import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Auth.css'; // ✅ Importing the dedicated CSS

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, { email, password }, { withCredentials: true });
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      alert('Authentication failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <div className="auth-toggle">
        {isLogin ? 'Need an account?' : 'Already have an account?'}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? ' Register' : ' Login'}
        </span>
      </div>
    </div>
  );
}
