import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create and export the context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (token, email) => {
    const expiryTime = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', expiryTime.toString());
    localStorage.setItem('user_email', email);
    setUser({ token, email, expiryTime });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user_email');
    setUser(null);
    navigate('/login');
  };

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem('token_expiry');
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const expiryTime = localStorage.getItem('token_expiry');
    const email = localStorage.getItem('user_email');

    if (token && expiryTime && email && !isTokenExpired()) {
      setUser({ token, email, expiryTime: parseInt(expiryTime) });
    } else {
      logout();
    }
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    const checkToken = () => {
      if (user && isTokenExpired()) {
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkToken, 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create and export the custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}