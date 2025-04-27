import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiSearch, FiCpu, FiPaperclip, FiSend, FiTrash2 } from 'react-icons/fi';
import ChatContainer from './ChatContainer';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [hoveredModel, setHoveredModel] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDelete, setShowDelete] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [displayedPrompts, setDisplayedPrompts] = useState([]);
  const longPressTimer = useRef(null);
  const textareaRef = useRef(null);

  const models = ['DeepSeek R1', 'Gemini', 'groq', 'OpenAI', 'Claude Sonet'];
  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "Creative ideas for a 10 year old's birthday",
    "How to make a React app with a clean UI?",
    "What is the theory of relativity?",
    "Suggest a workout plan for beginners",
    "How to cook a perfect steak",
    "Write a Python script for a to-do list app",
    "Explain blockchain technology",
    "Ideas for a sci-fi short story",
    "How to optimize a website for SEO",
    "What are the benefits of meditation?",
    "Create a simple JavaScript game",
    "How to start a small business",
    "Explain machine learning basics",
    "Suggest eco-friendly lifestyle changes"
  ];

  useEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    setDisplayedPrompts(shuffleArray(examplePrompts).slice(0, 4));
  }, []);

  const generateSessionId = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.token) {
        setChatHistory([]);
        setCurrentSessionId(null);
        return;
      }

      try {
        const response = await fetch('/api/ai_chat/history', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chat history: ${response.status}`);
        }

        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setChatHistory([]);
      }
    };

    fetchChatHistory();
  }, [user?.token]);

  const handleSelectChat = (chatId) => {
    const chat = chatHistory.find(chat => chat.chat_id === chatId);
    if (chat) {
      setSelectedChatId(chat.chat_id);
      setCurrentSessionId(chat.chat_id);
      setMessages(chat.messages.map(msg => ({
        content: msg.content,
        isUser: !msg.is_bot
      })));
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setCurrentSessionId(generateSessionId());
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/ai_chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }

      setChatHistory(chatHistory.filter(chat => chat.chat_id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
        setCurrentSessionId(generateSessionId());
      }
      setShowDelete(prev => {
        const newState = { ...prev };
        delete newState[chatId];
        return newState;
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !user?.token) return;

    const userMessage = { content, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    const sessionId = currentSessionId || generateSessionId();
    const chatId = selectedChatId || null;

    try {
      const response = await fetch('/api/ai_chat/request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          model: selectedModel.toLowerCase(),
          session_id: sessionId,
          chat_id: chatId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.content, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { content: 'Error: Failed to get response', isUser: false }]);
    }
  };

  const handleExamplePrompt = async (prompt) => {
    if (!user?.token) return;

    const userMessage = { content: prompt, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    const sessionId = currentSessionId || generateSessionId();
    const chatId = selectedChatId || null;

    try {
      const response = await fetch('/api/ai_chat/request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: prompt,
          model: 'gemini',
          session_id: sessionId,
          chat_id: chatId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send example prompt: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.content, isUser: false }]);
    } catch (error) {
      console.error('Error sending example prompt:', error);
      setMessages(prev => [...prev, { content: 'Error: Failed to get response', isUser: false }]);
    }
  };

  const handleLongPressStart = (chatId, e) => {
    e.preventDefault();
    longPressTimer.current = setTimeout(() => {
      setShowDelete(prev => ({
        ...prev,
        [chatId]: true
      }));
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClickOutsideDelete = (chatId) => {
    setShowDelete(prev => ({
      ...prev,
      [chatId]: false
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
    },
    sidebar: {
      position: 'absolute',
      top: '60px',
      left: sidebarVisible ? '0' : '-300px',
      width: '250px',
      height: 'calc(100% - 60px)',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      transition: 'left 0.3s ease',
      zIndex: 100,
      borderRight: '1px solid #e5e7eb',
    },
    chatHistoryContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '0.5rem',
      marginTop: '0.5rem',
    },
    newChatButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    chatHistoryItemContainer: {
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '0.5rem',
      borderRadius: '6px',
    },
    chatHistoryItem: {
      backgroundColor: '#f1f5f9',
      padding: '0.75rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#64748b',
      transition: 'transform 0.2s ease',
      position: 'relative',
      zIndex: 1,
    },
    deleteButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: '0',
      width: '80px',
      backgroundColor: '#ef4444',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 0,
      transition: 'opacity 0.2s ease',
    },
    navbar: {
      height: '60px',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 101,
      borderBottom: '1px solid #e5e7eb'
    },
    appName: {
      margin: 0,
      color: '#1e293b',
      fontWeight: '900',
      fontSize: '26px',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    chatContainer: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '2rem 2rem 10rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      justifyContent: 'center',
    },
    queryBar: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      padding: '1rem',
      width: '100%',
      maxWidth: '900px',
      minHeight: '96px',
      gap: '0.5rem',
      position: 'relative',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      position: 'relative',
    },
    messageInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: 'none',
      fontSize: '16px',
      backgroundColor: 'transparent',
      color: '#1e293b',
      outline: 'none',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '120px',
      lineHeight: '1.5',
      overflowY: 'auto'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#4b5563',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '40px',
      height: '40px',
    },
    iconButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
    },
    modelSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    sendButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#3b82f6',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
    },
    dropdownContent: {
      position: 'absolute',
      top: '35px',
      right: '0',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '0.5rem',
      minWidth: '160px',
      zIndex: 102,
      border: '1px solid #e5e7eb'
    },
    modelDropdownContent: {
      position: 'absolute',
      bottom: '100%',
      right: '0',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '0.5rem',
      minWidth: '160px',
      zIndex: 103,
      border: '1px solid #e5e7eb'
    },
    dropdownItem: {
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      color: '#1e293b',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      fontSize: '14px',
    },
    userMessage: {
      backgroundColor: '#e9e9e980',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '1rem',
      fontWeight: '450',
      fontSize: '16px',
      maxWidth: '80%',
      width: '100%',
      alignSelf: 'flex-end',
      border: '2px solid #e9e9e980',
      color: '#1e293b',
      wordBreak: 'break-all',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    botMessage: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '1rem',
      width: '900px', // Fixed width for bot messages
      maxWidth: '900px', // Ensures it doesn't exceed this width
      fontWeight: '450',
      fontSize: '16px',
      alignSelf: 'flex-start',
      border: '1px solid #e2e8f0',
      color: '#1e293b',
      wordBreak: 'break-word', // Wrap words nicely
      overflowWrap: 'break-word', // Ensure proper wrapping
      overflow: 'hidden',
      boxSizing: 'border-box',
      whiteSpace: 'pre-wrap', // Preserve spaces and wrap lines
    },
    examplePrompt: {
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      cursor: 'pointer',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div
        style={styles.sidebar}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <button
          style={styles.newChatButton}
          onClick={handleNewChat}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          + New Chat
        </button>
        <div style={styles.chatHistoryContainer}>
          {chatHistory.map(chat => (
            <div
              key={chat.chat_id}
              style={styles.chatHistoryItemContainer}
            >
              <div
                style={{
                  ...styles.chatHistoryItem,
                  backgroundColor: selectedChatId === chat.chat_id ? '#bbbdbf' : '#f1f5f9',
                  transform: showDelete[chat.chat_id] ? 'translateX(-80px)' : 'translateX(0)',
                }}
                onClick={() => {
                  if (!showDelete[chat.chat_id]) {
                    handleSelectChat(chat.chat_id);
                  } else {
                    handleClickOutsideDelete(chat.chat_id);
                  }
                }}
                onTouchStart={(e) => handleLongPressStart(chat.chat_id, e)}
                onTouchEnd={handleLongPressEnd}
                onMouseDown={(e) => handleLongPressStart(chat.chat_id, e)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
              >
                {chat.title}
              </div>
              <div
                style={{
                  ...styles.deleteButton,
                  opacity: showDelete[chat.chat_id] ? 1 : 0,
                  visibility: showDelete[chat.chat_id] ? 'visible' : 'hidden',
                }}
                onClick={(e) => handleDeleteChat(chat.chat_id, e)}
              >
                <FiTrash2 size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={styles.newChatButton}
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <FiMessageSquare size={15} />
            </button>
            <div
              onClick={handleNewChat}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#1e293b'}
            >
              <h1 style={styles.appName}>CUSTOM AI APPLICATION</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredUser(true)}
              onMouseLeave={() => setHoveredUser(false)}
            >
              <button style={styles.modelSelector}>
                <FiUser style={{ marginRight: '0.5rem' }} size={16} />
                {user?.email?.split('@')[0] || 'Account'}
              </button>
              {hoveredUser && (
                <div style={styles.dropdownContent}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => navigate('/profile')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Profile
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => navigate('/profile')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Settings
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={logout}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          setMessages={setMessages}
          examplePrompts={displayedPrompts}
          selectedChatId={selectedChatId}
          styles={styles}
          onExamplePromptClick={handleExamplePrompt}
          onSendMessage={handleSendMessage}
        />

        {/* Input Section */}
        <div style={styles.inputContainer}>
          <div style={styles.queryBar}>
            <div style={styles.inputRow}>
              <button
                style={styles.iconButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                aria-label="Attach file"
              >
                <FiPaperclip size={18} color="#4b5563" />
              </button>

              <textarea
                ref={textareaRef}
                placeholder="What do you want to know?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.messageInput}
              />

              <button
                style={styles.sendButton}
                onClick={() => handleSendMessage(message)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                aria-label="Send message"
              >
                <FiSend size={18} color="white" />
              </button>
            </div>

            <div style={styles.controlsRow}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={styles.actionButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  aria-label="DeepSearch"
                >
                  <FiSearch style={{ marginRight: '0.5rem' }} size={18} color="#4b5563" />
                  DeepSearch
                </button>

                <button
                  style={styles.actionButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  aria-label="Think"
                >
                  <FiCpu style={{ marginRight: '0.5rem' }} size={18} color="#4b5563" />
                  Think
                </button>
              </div>

              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredModel(true)}
                onMouseLeave={() => setHoveredModel(false)}
              >
                <div style={styles.modelSelector}>
                  {selectedModel}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {hoveredModel && (
                  <div style={styles.modelDropdownContent}>
                    {models.map(model => (
                      <div
                        key={model}
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;