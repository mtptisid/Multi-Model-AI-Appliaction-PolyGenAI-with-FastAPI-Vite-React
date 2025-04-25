// AuthPages.jsx
import { useState } from 'react';

const AuthPages = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      margin: 0,
      padding: '2rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      width: '100%',
      maxWidth: '800px',
      padding: '4rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem'
    },
    leftPanel: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      borderRadius: '12px',
      padding: '3rem',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center'
    },
    tabsContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2.5rem',
      background: '#f1f5f9',
      borderRadius: '8px',
      padding: '4px'
    },
    tabButton: {
      flex: 1,
      padding: '1rem 2rem',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      borderRadius: '6px',
      background: 'none'
    },
    activeTab: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
    },
    inactiveTab: {
      color: '#64748b',
      ':hover': {
        color: '#2563eb',
        background: 'rgba(37, 99, 235, 0.05)'
      }
    },
    inputLabel: {
      display: 'block',
      color: '#1e293b',
      marginBottom: '0.8rem',
      fontSize: '0.95rem',
      fontWeight: '500'
    },
    inputField: {
      width: '100%',
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      ':focus': {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
      }
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      marginTop: '1rem',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.2)'
      }
    },
    link: {
      color: '#2563eb',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline'
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '900' }}>
            {activeTab === 'login' ? 'Custom AI Solution Application' : 'Get Started'}
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6' }}>
            {activeTab === 'login' 
              ? 'Sign in to access your custom AI experience' 
              : 'Create an account to unlock all features'}
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={styles.tabsContainer}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'login' ? styles.activeTab : styles.inactiveTab)
              }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'signup' ? styles.activeTab : styles.inactiveTab)
              }}
            >
              Signup
            </button>
          </div>

          {activeTab === 'login' ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={styles.inputLabel}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  style={styles.inputField}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={styles.inputLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  style={styles.inputField}
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <a style={styles.link}>Forgot password?</a>
              </div>

              <button style={styles.primaryButton}>Sign In</button>

              <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <span style={styles.link} onClick={() => setActiveTab('signup')}>
                  Create account
                </span>
              </div>
            </form>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={styles.inputLabel}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  style={styles.inputField}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={styles.inputLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  style={styles.inputField}
                  placeholder="Create a password"
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={styles.inputLabel}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  style={styles.inputField}
                  placeholder="Confirm your password"
                  onChange={handleInputChange}
                />
              </div>

              <button style={styles.primaryButton}>Create Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPages;