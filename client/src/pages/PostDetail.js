import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.post);
    } catch (error) {
      setError('Post não encontrado');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/posts/${id}/like`);
      setPost(prev => ({ ...prev, likes: response.data.likes }));
      setLiked(true);
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="main">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="main">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="container">
        <article style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {post.featuredImage && (
            <img 
              src={post.featuredImage} 
              alt={post.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }}
            />
          )}

          <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags" style={{ marginBottom: '1rem' }}>
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666' }}>
              <span>Por <strong>{post.author?.name}</strong></span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </header>

          <div 
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              marginBottom: '2rem'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={handleLike}
                disabled={liked}
                className={`btn ${liked ? 'btn-outline' : 'btn-primary'}`}
              >
                ❤️ {post.likes} curtidas
              </button>
              <span style={{ color: '#666' }}>👁️ {post.views} visualizações</span>
            </div>

            <button onClick={() => navigate('/')} className="btn btn-outline">
              ← Voltar
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;