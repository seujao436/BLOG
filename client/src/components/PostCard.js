import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <article className="post-card">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="post-image"
        />
      )}
      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h2>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <p className="post-excerpt">{post.excerpt}</p>

        <div className="post-meta">
          <span>Por {post.author?.name}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;