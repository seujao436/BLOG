import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAllPosts();
    }
  }, [isAuthenticated, user]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts?limit=100');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        alert('Erro ao deletar post');
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleTogglePublished = async (post) => {
    const updatedStatus = !post.published;
    if (window.confirm(`Tem certeza que deseja ${updatedStatus ? 'publicar' : 'despublicar'} este post?`)) {
      try {
        const response = await api.put(`/posts/${post._id}`, { published: updatedStatus });
        setPosts(posts.map(p => p._id === post._id ? response.data.post : p));
      } catch (error) {
        alert('Erro ao atualizar status do post');
      }
    }
  };

  const handlePostSaved = (savedPost) => {
    if (editingPost) {
      setPosts(posts.map(post => post._id === savedPost._id ? savedPost : post));
    } else {
      setPosts([savedPost, ...posts]);
    }
    setShowEditor(false);
    setEditingPost(null);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (showEditor) {
    return <PostEditor post={editingPost} onSave={handlePostSaved} onCancel={() => {
      setShowEditor(false);
      setEditingPost(null);
    }} />;
  }

  return (
    <div className="main">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Administração</h1>
          <button 
            onClick={() => setShowEditor(true)} 
            className="btn btn-primary"
          >
            Novo Post
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando posts...</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {posts.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Nenhum post encontrado</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Título</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Data</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Views</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Curtidas</th>
                    <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '1rem' }}>
                        <strong>{post.title}</strong>
                        {!post.published && <span className="badge badge-draft">Rascunho</span>}
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '1rem' }}>{post.views}</td>
                      <td style={{ padding: '1rem' }}>{post.likes}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleTogglePublished(post)}
                          className={`btn btn-sm ${post.published ? 'btn-secondary' : 'btn-success'}`}
                          style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                        >
                          {post.published ? 'Despublicar' : 'Publicar'}
                        </button>
                        <button 
                          onClick={() => handleEdit(post)}
                          className="btn btn-sm btn-outline"
                          style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id)}
                          className="btn btn-sm btn-danger"
                          style={{ fontSize: '0.8rem' }}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Post Editor Component
const PostEditor = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    tags: post?.tags?.join(', ') || '',
    featuredImage: post?.featuredImage || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (published) => {
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published
      };

      let response;
      if (post) {
        response = await api.put(`/posts/${post._id}`, postData);
      } else {
        response = await api.post('/posts', postData);
      }

      onSave(response.data.post);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="editor-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1>{post ? 'Editar Post' : 'Novo Post'}</h1>
            <button onClick={onCancel} className="btn btn-outline">
              Cancelar
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título do post..."
                className="editor-title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="featuredImage">Imagem destacada (URL)</label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="form-control"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (separadas por vírgula)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-control"
                placeholder="react, node, javascript"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Conteúdo</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-control textarea"
                rows="15"
                placeholder="Escreva o conteúdo do seu post aqui..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Rascunho'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Publicando...' : (post?.published ? 'Atualizar Post' : 'Publicar')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;