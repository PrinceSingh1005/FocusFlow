import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
        const result = await window.chrome.storage.local.get('token');
        if (result.token) {
          const decodedToken = jwtDecode(result.token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setToken(result.token);
          } else {
            // Token expired
            await window.chrome.storage.local.remove('token');
          }
        }
      } else {
        // Chrome extension APIs not available
        console.error('Chrome extension APIs not available.');
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = async () => {
    if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
      await window.chrome.storage.local.remove(['token', 'preferences']);
      setToken(null);
      // Notify background script to clear blocking rules
      window.chrome.runtime.sendMessage({ action: 'updateBlocking' });
    } else {
      setToken(null);
      console.error('Chrome extension APIs not available.');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="App">
      {token ? (
        <Dashboard onLogout={handleLogout} token={token} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;