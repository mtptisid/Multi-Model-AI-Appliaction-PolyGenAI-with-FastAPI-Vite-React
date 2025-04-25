# 💬 Personal AI Platform (PAP)

A modern AI-powered multi-model chat application inspired by ChatGPT, powered by **FastAPI**, **React**, and **multiple LLM APIs** like OpenAI, Claude, Gemini, and Groq. It features a stylish frontend, seamless model switching, interactive examples, chat history, and secure user login.

---

## 🚀 Features

- 🔐 JWT-based user authentication  
- 🧠 Dynamic LLM model switching (GPT, Claude, Gemini, Groq)  
- 💬 Chat with memory/history  
- 🎨 Beautiful frontend with gradient design and example prompts  
- 🖥️ Sidebar toggle on hover  
- ⚙️ Modular backend using FastAPI  
- 📦 Docker-ready and easily deployable  

---

## 🧰 Tech Stack

| Layer       | Tech                            |
|-------------|---------------------------------|
| Frontend    | React + Tailwind CSS + Vite     |
| Backend     | FastAPI (Python)                |
| LLMs        | OpenAI, Claude, Gemini, Groq    |
| Auth        | JWT                             |
| Deployment  | Docker, Netlify, Vercel, GCP    |

---

## 📡 FastAPI Backend Endpoints

### 🔐 Auth Routes

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/auth/register` | Register a new user             |
| POST   | `/auth/login`    | Login and receive JWT token     |

**Example Request:**
```python
POST /auth/register
{
  "username": "yourname",
  "password": "yourpassword"
}
```

---

### 💬 Chat Routes

| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| POST   | `/chat/send`    | Send message to selected AI model        |
| GET    | `/chat/history` | Get previous messages (requires token)   |

**Example Request:**
```python
POST /chat/send
{
  "message": "What's the weather like today?",
  "model": "openai",  # Options: openai, claude, gemini, groq
  "chat_id": "session_id_123"
}
```

---

## 🖥️ Frontend Structure

- `App.jsx` - Main app component with routing  
- `ChatWindow.jsx` - Chat UI and message rendering  
- `Sidebar.jsx` - Hover-enabled toggleable sidebar for chat history  
- `Dropdown.jsx` - Switch between LLM models  
- `Examples.jsx` - Beautiful gradient example prompts  
- `Login.jsx` / `Register.jsx` - Auth screens  

---

## 🔌 AI Model Switching Logic

The chat frontend uses a dropdown to select one of the available AI models. Based on selection:
```javascript
const models = ['openai', 'claude', 'gemini', 'groq'];

function handleModelChange(model) {
  setSelectedModel(model);
}
```

---

## 📦 Docker Setup

You can easily run this app using Docker. The Docker setup contains the entire backend and frontend.

1. Build Docker image:

```bash
docker build -t personal-ai-platform .
```

2. Run Docker container:

```bash
docker run -p 8000:8000 -p 3000:3000 personal-ai-platform
```

---

## 🚀 Deployment

The app can be deployed using various platforms like Netlify for the frontend and Google Cloud Platform (GCP) for the backend.

- **Frontend**: Deploy the React app on Netlify, Vercel, or any static hosting service.
- **Backend**: Deploy the FastAPI app using Docker containers or directly on cloud platforms like Google Cloud (GCP), AWS, or Azure.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.