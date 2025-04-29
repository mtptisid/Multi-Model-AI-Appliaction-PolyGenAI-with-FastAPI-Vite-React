import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiSearch, FiCpu, FiPaperclip, FiArrowUpRight, FiTrash2, FiArrowDown } from 'react-icons/fi';
import { FaBrain, FaBirthdayCake, FaCode, FaRocket } from 'react-icons/fa';
import ChatContainer from './ChatContainer';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [hoveredModel, setHoveredModel] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDelete, setShowDelete] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [displayedPrompts, setDisplayedPrompts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [username, setUsername] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const longPressTimer = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const models = ['DeepSeek R1', 'Gemini', 'Groq', 'OpenAI', 'Claude Sonet'];
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
    "Suggest eco-friendly lifestyle changes",
    "tell me something about AI",
    "How to create a k8s cluster",
    "how to prepare for software engineer interview",
    "How i can make 1 million in 30 days"
  ];

  const promptIcons = {
    "Explain quantum computing in simple terms": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "🧠" },
    "Creative ideas for a 10 year old's birthday": { icon: <FaBirthdayCake size={18} color="#ef4444" />, emoji: "🎉" },
    "How to make a React app with a clean UI?": { icon: <FaCode size={18} color="#10b981" />, emoji: "💻" },
    "What is the theory of relativity?": { icon: <FaRocket size={18} color="#8b5cf6" />, emoji: "🚀" },
    "Suggest a workout plan for beginners": { icon: null, emoji: "💪" },
    "How to cook a perfect steak": { icon: null, emoji: "🥩" },
    "Write a Python script for a to-do list app": { icon: <FaCode size={18} color="#10b981" />, emoji: "📝" },
    "Explain blockchain technology": { icon: null, emoji: "🔗" },
    "Ideas for a sci-fi short story": { icon: null, emoji: "👽" },
    "How to optimize a website for SEO": { icon: null, emoji: "🌐" },
    "What are the benefits of meditation?": { icon: null, emoji: "🧘" },
    "Create a simple JavaScript game": { icon: <FaCode size={18} color="#10b981" />, emoji: "🎮" },
    "How to start a small business": { icon: null, emoji: "🏬" },
    "Explain machine learning basics": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "🤖" },
    "Suggest eco-friendly lifestyle changes": { icon: null, emoji: "🌿" },
    "tell me something about AI": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "🧠" },
    "How to create a k8s cluster": { icon: <FaCode size={18} color="#10b981" />, emoji: "☁️" },
    "how to prepare for software engineer interview": { icon: <FaCode size={18} color="#10b981" />, emoji: "📚" },
    "How i can make 1 million in 30 days": { icon: null, emoji: "💰" }
  };

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      if (!user || !user.token) {
        setWelcomeMessage('');
        setSubMessage('');
        return;
      }

      try {
        const response = await fetch('/api/ai_chat/home', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch welcome message: ${response.status}`);
        }

        const data = await response.json();
        setWelcomeMessage(data.data.message || 'Welcome!');
        setSubMessage(data.data.submsg || '');
      } catch (error) {
        console.error('Error fetching welcome message:', error);
        setWelcomeMessage('');
        setSubMessage('');
      }
    };

    fetchWelcomeMessage();
  }, [user]);

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

  useEffect(() => {
    fetchChatHistory();
    const intervalId = setInterval(fetchChatHistory, 30000);
    return () => clearInterval(intervalId);
  }, [user?.token]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.token) {
        setUsername(user?.email?.split('@')[0] || 'Account');
        return;
      }

      try {
        const response = await fetch('/api/user/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch username: ${response.status}`);
        }

        const data = await response.json();
        setUsername(data.name || user?.email?.split('@')[0] || 'Account');
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(user?.email?.split('@')[0] || 'Account');
      }
    };

    fetchUsername();
  }, [user?.token, user?.email]);

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
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      console.log('Messages after adding user message:', updatedMessages);
      return updatedMessages;
    });
    setMessage('');

    const sessionId = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      console.warn('currentSessionId was null; generated new session_id:', sessionId);
      setCurrentSessionId(sessionId);
    }
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
      setMessages(prev => {
        const updatedMessages = [...prev, { content: data.content, isUser: false }];
        console.log('Messages after adding bot response:', updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const updatedMessages = [...prev, { content: 'Error: Failed to get response', isUser: false }];
        console.log('Messages after error:', updatedMessages);
        return updatedMessages;
      });
    }
  };

  const handleExamplePrompt = async (prompt) => {
    if (!user?.token) return;

    const userMessage = { content: prompt, isUser: true };
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      console.log('Messages after adding example prompt:', updatedMessages);
      return updatedMessages;
    });

    const sessionId = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      console.warn('currentSessionId was null; generated new session_id:', sessionId);
      setCurrentSessionId(sessionId);
    }
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
      setMessages(prev => {
        const updatedMessages = [...prev, { content: data.content, isUser: false }];
        console.log('Messages after adding bot response for prompt:', updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending example prompt:', error);
      setMessages(prev => {
        const updatedMessages = [...prev, { content: 'Error: Failed to get response', isUser: false }];
        console.log('Messages after error for prompt:', updatedMessages);
        return updatedMessages;
      });
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
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setShowScrollButton(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { root: chatContainerRef.current, threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [messages.length]);

  const groupChatsByDate = () => {
    const grouped = {};
    chatHistory.forEach(chat => {
      let dateKey = 'Unknown Date';
      let timestamp = null;

      if (typeof chat.created_at === 'string' && chat.created_at.trim() !== '') {
        try {
          const date = new Date(chat.created_at);
          if (!isNaN(date.getTime())) {
            timestamp = date;
            dateKey = date.toISOString().split('T')[0];
          } else {
            console.warn(`Invalid created_at for chat ${chat.chat_id}: ${chat.created_at}`);
          }
        } catch (error) {
          console.warn(`Error parsing created_at for chat ${chat.chat_id}: ${chat.created_at}`, error);
        }
      }

      if (!timestamp && Array.isArray(chat.messages) && chat.messages.length > 0) {
        const validTimestamps = chat.messages
          .filter(msg => typeof msg.timestamp === 'string' && msg.timestamp.trim() !== '')
          .map(msg => {
            try {
              const date = new Date(msg.timestamp);
              return isNaN(date.getTime()) ? null : date;
            } catch {
              return null;
            }
          })
          .filter(date => date !== null);

        if (validTimestamps.length > 0) {
          timestamp = new Date(Math.min(...validTimestamps.map(date => date.getTime())));
          dateKey = timestamp.toISOString().split('T')[0];
        } else {
          console.warn(`No valid timestamps in messages for chat ${chat.chat_id}`);
        }
      }

      if (!timestamp) {
        console.warn(`No valid timestamp for chat ${chat.chat_id}: created_at=${chat.created_at}, messages=${JSON.stringify(chat.messages)}`);
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(chat);
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === 'Unknown Date') return 1;
        if (b === 'Unknown Date') return -1;
        return new Date(b) - new Date(a);
      })
      .reduce((obj, key) => {
        obj[key] = grouped[key];
        return obj;
      }, {});
  };

  const formatDate = (dateString) => {
    if (dateString === 'Unknown Date') return dateString;
    return dateString; // Returns YYYY-MM-DD (e.g., "2025-04-28")
  };

  const renderWelcomeMessage = () => {
    if (!welcomeMessage) return null;
    const [prefix, userName] = welcomeMessage.split('-');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.welcomeMessage}>
          {prefix.trim().split('').map((char, index) => (
            <span
              key={index}
              style={{
                animation: `fadeInScale 0.5s ease-in-out ${index * 0.05}s forwards`,
                fontSize: '38px',
                opacity: 0,
                display: char === ' ' ? 'inline' : 'inline-block',
              }}
            >
              {char}
            </span>
          ))}
          <span
            style={{
              animation: `fadeInScale 0.5s ease-in-out ${prefix.trim().length * 0.05}s forwards`,
              opacity: 0,
              padding: '1rem',
              fontSize: '50px',
              display: 'inline-block',
              color: '#d91a89',
              fontWeight: '800',
            }}
          >
            {userName ? userName.trim() : ''}
          </span>
        </div>
        {subMessage && (
          <div
            style={{
              ...styles.welcomeMessage,
              fontSize: '26px',
              marginTop: '2rem',
              color: '#6b7280', 
              textShadow: '0 0 5px rgba(107, 114, 128, 0.5)', 
            }}
          >
            {subMessage}
          </div>
        )}
      </div>
    );
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
      position: 'fixed',
      top: '60px',
      left: sidebarVisible ? '0' : '-300px',
      width: '250px',
      height: 'calc(100vh - 60px)',
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
    dateHeader: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '1rem 0 0.5rem',
      paddingLeft: '0.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    newChatButton: {
      backgroundColor: '#404347',
      color: 'white',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '20px',
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
      zIndex: '1 !important',
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
      position: 'fixed',
      width: '99%',
      height: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      top: 0,
      zIndex: 101,
      borderBottom: '1px solid #e5e7eb'
    },
    appName: {
      margin: 0,
      color: '#ffffff',
      fontWeight: '500',
      fontSize: '30px',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.6)'
    },
    promptsContainer: {
      paddingTop: '80px',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: 'calc(100vh - 60px)',
      overflowY: 'hidden',
      boxSizing: 'border-box',
    },
    chatContainer: {
      margin: '0 1rem',
      padding: '40px 1rem 75px',
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      paddingBottom: '80px',
      position: 'relative',
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
      backgroundColor: '#404347',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
    },
    scrollButton: {
      position: 'fixed',
      bottom: '120px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '50%',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
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
      marginBottom: '0',
      fontWeight: '450',
      fontSize: '16px',
      maxWidth: '900px',
      width: 'auto',
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
      width: '900px',
      overflowX: 'hidden',
      maxWidth: '900px',
      fontWeight: '450',
      fontSize: '16px',
      alignSelf: 'flex-start',
      border: '1px solid #e2e8f0',
      color: '#1e293b',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      boxSizing: 'border-box',
      whiteSpace: 'pre-wrap',
    },
    examplePrompt: {
      padding: '2rem',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      borderRadius: '20px',
      cursor: 'pointer',
      flex: '1',
      maxWidth: '400px',
      minWidth: '250px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      boxShadow: '0 9px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      outline: 'none',
      position: 'relative',
    },
    promptRow: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '900px',
      position: 'relative',
    },
    welcomeMessage: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#404347',
      textAlign: 'center',
      marginTop: '1rem',
      marginBottom: '1rem',
      maxWidth: '900px',
      width: '100%',
      lineHeight: '1.2',
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.sidebar}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <button
          style={styles.newChatButton}
          onClick={handleNewChat}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#404347'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
        >
          + New Chat
        </button>
        <div style={styles.chatHistoryContainer}>
          {Object.entries(groupChatsByDate()).map(([date, chats]) => (
            <div key={date}>
              <h3 style={styles.dateHeader}>{formatDate(date)}</h3>
              {chats.map(chat => (
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
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={styles.newChatButton}
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <FiMessageSquare size={15} />
            </button>
            <div
              onClick={() => {
                handleNewChat();
                navigate('/api/ai_chat/home');
              }}
              onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              <h1 style={styles.appName}>PolyGenAI - Multi Model AI App</h1>
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
                {username || 'Account'}
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

        {messages.length === 0 && (
          <div style={styles.promptsContainer}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {[...Array(Math.ceil(displayedPrompts.length / 2))].map((_, rowIndex) => (
                <div key={rowIndex} style={styles.promptRow}>
                  {displayedPrompts.slice(rowIndex * 2, rowIndex * 2 + 2).map((prompt, idx) => (
                    <div
                      key={idx}
                      style={styles.examplePrompt}
                      onClick={() => handleExamplePrompt(prompt)}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 9px 20px rgba(0,0,0,0.15)';
                      }}
                    >
                      {promptIcons[prompt]?.icon || null}
                      <span style={{ flex: 1 }}>{prompt}</span>
                      <span>{promptIcons[prompt]?.emoji}</span>
                    </div>
                  ))}
                </div>
              ))}
              {renderWelcomeMessage()}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div ref={chatContainerRef} style={styles.chatContainer}>
            <ChatContainer
              messages={messages}
              setMessages={setMessages}
              examplePrompts={messages.length === 0 ? [] : displayedPrompts}
              selectedChatId={selectedChatId}
              styles={styles}
              onExamplePromptClick={handleExamplePrompt}
              onSendMessage={handleSendMessage}
            />
            <div ref={bottomRef} />
          </div>
        )}

        {showScrollButton && (
          <button
            style={styles.scrollButton}
            onClick={scrollToBottom}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            aria-label="Scroll to bottom"
          >
            <FiArrowDown size={18} color="#4b5563" />
          </button>
        )}

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
                onClick={() => {
                  handleSendMessage(message);
                  setMessage('');
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                aria-label="Send message"
              >
                <FiArrowUpRight size={18} color="white" />
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