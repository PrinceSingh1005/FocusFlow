import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/api';

/**
 * A component that renders the login and registration form.
 * @param {object} props - Component props.
 * @param {function} props.onLogin - Callback function to execute on successful login.
 */
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = isRegister
        ? await registerUser(email, password)
        : await loginUser(email, password);
      
      // Store the token in Chrome's local storage for persistence
      await window.chrome.storage.local.set({ token: data.token });
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <br /><br />
        <button type="submit" className="btn btn-primary">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <br />
      <button onClick={() => setIsRegister(!isRegister)} className="btn btn-secondary">
        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
};

export default Login;