import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">Meu Blog</Link>

          <nav>
            <ul className="nav">
              <li><Link to="/">Home</Link></li>
              {isAuthenticated && user?.role === 'admin' && (
                <li><Link to="/admin">Admin</Link></li>
              )}
            </ul>
          </nav>

          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <span>Olá, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Registrar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;