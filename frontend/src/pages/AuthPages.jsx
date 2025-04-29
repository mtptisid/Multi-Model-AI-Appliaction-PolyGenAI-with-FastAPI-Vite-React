import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const AuthPages = () => {
  const navigate = useNavigate();
  const { user, login: authLogin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/api/ai_chat/home');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (activeTab === 'login') {
        response = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      authLogin(response.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '90vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '97vw',
      margin: 0,
      padding: '2rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      width: '100%',
      maxWidth: '1200px',
      padding: '4rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '4rem'
    },
    leftPanel: {
      background: 'linear-gradient(145deg, #0a2e5a 0%, #021a38 100%)',
      borderRadius: '12px',
      padding: '3rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
    },
    animationCard: {
      width: '100%',
      height: '100%',
      position: 'relative',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardFace: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 30px rgba(79, 195, 247, 0.3)',
      transformStyle: 'preserve-3d',
      backdropFilter: 'blur(8px)'
    },
    formPanel: {
      position: 'relative'
    },
    animationPanel: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '12px'
    },
    gifContainer: {
      background: 'black',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    gif: {
      width: '100%',
      maxWidth: '400px',
      aspectRatio: '800 / 600',
      objectFit: 'cover',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
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
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      borderRadius: '6px',
      background: 'none'
    },
    activeTab: {
      background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
      color: 'white',
      boxShadow: '0 0 12px rgba(79, 195, 247, 0.4)'
    },
    inactiveTab: {
      color: '#64748b',
      ':hover': {
        color: '#4fc3f7',
        background: 'rgba(79, 195, 247, 0.05)',
        boxShadow: '0 0 8px rgba(79, 195, 247, 0.2)'
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
        borderColor: '#4fc3f7',
        boxShadow: '0 0 8px rgba(79, 195, 247, 0.3)'
      }
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      marginTop: '1rem',
      boxShadow: '0 0 10px rgba(79, 195, 247, 0.4)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 16px rgba(79, 195, 247, 0.6)'
      }
    },
    link: {
      color: '#4fc3f7',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      ':hover': {
        textDecoration: 'underline',
        textShadow: '0 0 5px rgba(79, 195, 247, 0.3)'
      }
    },
    error: {
      color: '#dc2626',
      marginBottom: '1rem',
      textAlign: 'center'
    }
  };

  const animationStyles = `
    @keyframes floatIn {
      0% {
        opacity: 0;
        transform: translateZ(-500px) rotateX(-90deg);
        filter: blur(20px);
      }
      100% {
        opacity: 1;
        transform: translateZ(0) rotateX(0);
        filter: blur(0);
      }
    }

    @keyframes textGlow {
      0%, 100% {
        text-shadow: 0 0 10px rgba(79, 195, 247, 0.5),
                     0 0 20px rgba(79, 195, 247, 0.3),
                     0 0 30px rgba(79, 195, 247, 0.2);
      }
      50% {
        text-shadow: 0 0 20px rgba(79, 195, 247, 0.8),
                     0 0 30px rgba(79, 195, 247, 0.6),
                     0 0 40px rgba(79, 195, 247, 0.4);
      }
    }

    @keyframes particleOrbit {
      0% {
        transform: translate(0, 0) rotate(0deg) translateZ(0);
        opacity: 0.8;
      }
      50% {
        transform: translate(30px, -30px) rotate(180deg) translateZ(100px);
        opacity: 0.4;
      }
      100% {
        transform: translate(0, 0) rotate(360deg) translateZ(0);
        opacity: 0.8;
      }
    }

    .animation-card:hover {
      transform: rotateY(5deg) rotateX(5deg) scale(1.05);
    }

    .card-face {
      transform: translateZ(50px);
    }

    .card-title {
      font-size: 2.6rem;
      font-weight: 800;
      background: linear-gradient(45deg, #4fc3f7, #ffffff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: textGlow 2s ease-in-out infinite,
                 floatIn 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      transform: translateZ(80px);
      margin-bottom: 1.5rem;
      text-align: 'center';
    }

    .card-tagline {
      font-size: 1.5rem;
      color: #ffffff;
      animation: floatIn 1.5s 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      transform: translateZ(60px);
      text-align: center;
      max-width: 80%;
      line-height: 1.6;
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(79, 195, 247, 0.6), transparent);
      animation: particleOrbit 4s ease-in-out infinite;
      pointer-events: none;
    }

    .left-panel::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, 
        transparent 45%, 
        rgba(79, 195, 247, 0.1) 50%, 
        transparent 55%);
      animation: shine 6s infinite linear;
      z-index: 1;
    }

    @keyframes shine {
      0% { transform: rotate(0deg) translateZ(0); }
      100% { transform: rotate(360deg) translateZ(0); }
    }

    .left-panel::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 50%, 
        rgba(79, 195, 247, 0.1) 0%, 
        rgba(79, 195, 247, 0) 70%);
      pointer-events: none;
      z-index: 1;
    }
  `;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.leftPanel}>
            <div
              style={styles.animationCard}
              className="animation-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.cardFace} className="card-face">
                <h2 className="card-title">
                  {activeTab === 'login' ? 'Custom AI Solution Application' : 'Get Started'}
                </h2>
                <p className="card-tagline">
                  {activeTab === 'login'
                    ? 'Sign in to access your custom AI experience'
                    : 'Create an account to unlock all features'}
                </p>
              </div>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    width: `${8 + Math.random() * 12}px`,
                    height: `${8 + Math.random() * 12}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    transform: `translateZ(${Math.random() * 100 - 50}px)`
                  }}
                />
              ))}
            </div>
          </div>

          <div style={styles.formPanel}>
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

            {error && <div style={styles.error}>{error}</div>}

            {activeTab === 'login' ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={styles.inputLabel}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    style={styles.inputField}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>Password</label>
                  <input
                    type="password"
                    name="password"
                    style={styles.inputField}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <a style={styles.link}>Forgot password?</a>
                </div>

                <button
                  style={styles.primaryButton}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                  Don't have an account?{' '}
                  <span style={styles.link} onClick={() => setActiveTab('signup')}>
                    Create account
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    style={styles.inputField}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    style={styles.inputField}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>Password</label>
                  <input
                    type="password"
                    name="password"
                    style={styles.inputField}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={styles.inputField}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  style={styles.primaryButton}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>

          <div style={styles.animationPanel}>
            <div style={styles.gifContainer}>
              <img
                src="./a9176696b8740c402d84b55374ea0107_w200.gif"
                alt="AI Animation"
                style={styles.gif}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPages;