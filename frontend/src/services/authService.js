import axios from 'axios';

const API_BASE = '/api/auth';

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE}/login`,
      new URLSearchParams({
        name: credentials.name,
        username: credentials.email,
        password: credentials.password,
        grant_type: 'password'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};