
// The base URL for your backend API.
const API_URL = 'http://localhost:5000/api';

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The server response containing the auth token.
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Login failed');
  }
  return response.json();
};

/**
 * Registers a new user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The server response containing the auth token.
 */
export const registerUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Registration failed');
  }
  return response.json();
};

/**
 * Fetches the user's preferences (e.g., blocked sites).
 * @param {string} token - The user's JWT authentication token.
 * @returns {Promise<object>} - The user's preferences.
 */
export const getPreferences = async (token) => {
  const response = await fetch(`${API_URL}/preferences`, {
    headers: { 'x-auth-token': token },
  });
  if (!response.ok) throw new Error('Failed to fetch preferences');
  return response.json();
};

/**
 * Updates the user's preferences.
 * @param {string} token - The user's JWT authentication token.
 * @param {object} preferences - The new preferences object.
 * @returns {Promise<object>} - The updated preferences.
 */
export const updatePreferences = async (token, preferences) => {
  const response = await fetch(`${API_URL}/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error('Failed to update preferences');
  return response.json();
};

/**
 * Fetches the daily productivity report.
 * @param {string} token - The user's JWT authentication token.
 * @returns {Promise<Array>} - An array of time log objects.
 */
export const getDailyReport = async (token) => {
    const response = await fetch(`${API_URL}/reports/daily`, {
        headers: { 'x-auth-token': token },
    });
    if (!response.ok) throw new Error('Failed to fetch daily report');
    return response.json();
};