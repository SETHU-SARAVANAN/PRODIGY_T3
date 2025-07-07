import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => setIsAuthenticated(false));
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🛍️ MyStore</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Products</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/orders">Orders</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
