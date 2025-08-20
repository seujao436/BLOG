import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/posts?page=${pageNum}&limit=6`);
      const newPosts = response.data.posts;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(pageNum < response.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      setError('Erro ao carregar posts');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Bem-vindo ao Meu Blog
        </h1>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {loading && page === 1 && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando posts...</p>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>Nenhum post encontrado</h2>
            <p>Seja o primeiro a publicar um post!</p>
          </div>
        )}

        {hasMore && posts.length > 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={loadMore} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Ver mais posts'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;