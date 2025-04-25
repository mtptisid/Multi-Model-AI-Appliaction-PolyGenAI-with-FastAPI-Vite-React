import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('OpenAI');
  const [hoveredModel, setHoveredModel] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const models = ['OpenAI', 'Gemini', 'Groq', 'Claude'];
  const examplePrompts = [
    "🌟 Explain quantum computing in simple terms",
    "🎉 Got any creative ideas for a 10 year old’s birthday?",
    "💻 How do I make a React app look like ChatGPT UI?"
  ];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0f7fa)',
    },
    sidebar: {
      position: 'absolute',
      top: '60px',
      left: sidebarVisible ? '0' : '-250px',
      width: '250px',
      height: '100%',
      background: 'linear-gradient(to bottom right, #e0f2fe, #f3e8ff)',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      transition: 'left 0.3s ease',
      zIndex: 100,
    },
    newChatButton: {
      background: 'linear-gradient(to right, #4ade80, #22d3ee)',
      color: 'white',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '1rem',
      fontSize: '14px',
    },
    chatHistoryItem: {
      backgroundColor: 'rgba(255,255,255,0.4)',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      fontSize: '14px',
    },
    navbar: {
      height: '60px',
      background: 'linear-gradient(to right, #c7d2fe, #e0f2fe)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 101,
    },
    chatContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '3rem 1rem 6rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    inputContainer: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: 'linear-gradient(to right, #f0fdfa, #fefce8)',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    messageInput: {
      flex: 1,
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
    },
    button: {
      padding: '0.75rem 1.2rem',
      background: 'linear-gradient(to right, #38bdf8, #818cf8)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'relative',
    },
    dropdownContent: {
      position: 'absolute',
      right: 0,
      top: '40px',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '0.5rem',
      minWidth: '160px',
      zIndex: 1001,
    },
    dropdownItem: {
      padding: '0.5rem',
      cursor: 'pointer',
      color: '#1e293b',
    },
    userMessage: {
      backgroundColor: '#e0f2fe',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      maxWidth: '80%',
      alignSelf: 'flex-end',
    },
    botMessage: {
      backgroundColor: '#ede9fe',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      maxWidth: '80%',
      alignSelf: 'flex-start',
    },
    examplePrompt: {
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
      color: 'white',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      cursor: 'pointer',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div
        style={styles.sidebar}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <button style={styles.newChatButton}>+ New Chat</button>
        <div style={styles.chatHistoryItem}>🧠 AI & Quantum</div>
        <div style={styles.chatHistoryItem}>🤖 Reenforcement Learning</div>
        <div style={styles.chatHistoryItem}>⚛️ Build React UI</div>
      </div>

      <div style={{ flex: 1 }}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={styles.button}
              onMouseEnter={() => setSidebarVisible(true)}
            >
              ☰
            </button>
            <h1 style={{ margin: 0, color: '#0f172a', fontWeight: '600', fontSize: '20px' }}>Custom AI Application</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Model Dropdown */}
            <div
              style={styles.dropdown}
              onMouseEnter={() => setHoveredModel(true)}
              onMouseLeave={() => setHoveredModel(false)}
            >
              <button style={styles.button}>{selectedModel} ▼</button>
              {hoveredModel && (
                <div style={styles.dropdownContent}>
                  {models.map(model => (
                    <div
                      key={model}
                      style={styles.dropdownItem}
                      onClick={() => {
                        setSelectedModel(model);
                        setHoveredModel(false);
                      }}
                    >
                      {model}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div
              style={styles.dropdown}
              onMouseEnter={() => setHoveredUser(true)}
              onMouseLeave={() => setHoveredUser(false)}
            >
              <button style={styles.button}>
                {user?.email?.split('@')[0] || 'User'} ▼
              </button>
              {hoveredUser && (
                <div style={styles.dropdownContent}>
                  <div style={styles.dropdownItem}>Profile</div>
                  <div style={styles.dropdownItem}>Settings</div>
                  <div style={styles.dropdownItem}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Chat Container */}
        <div style={styles.chatContainer}>
          {messages.length === 0 && examplePrompts.map((prompt, idx) => (
            <div
              key={idx}
              style={styles.examplePrompt}
              onClick={() => setMessage(prompt)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {prompt}
            </div>
          ))}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.isUser ? styles.userMessage : styles.botMessage}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.messageInput}
          />
          <button style={styles.button}>📎</button>
          <button style={styles.button}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;