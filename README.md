# PolyGenAI

**PolyGenAI** is a cutting-edge web application designed to provide a unified platform for interacting with multiple Generative AI models, including DeepSeek R1, Gemini, Groq (with LLaMA), OpenAI, and Claude Sonet. With a sleek, animated user interface, robust chat functionality, and features like chat history management, markdown-parsed responses, and user profile customization, PolyGenAI offers a seamless and engaging experience for users exploring AI capabilities. Whether you're a casual user curious about AI or a developer integrating multiple models, PolyGenAI simplifies the process with an intuitive and visually appealing design.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

PolyGenAI aims to democratize access to Generative AI by allowing users to interact with multiple AI models through a single interface. The application features a modern frontend built with React, animated login/register pages, and a responsive chat interface where users can select their preferred AI model, send messages, and receive formatted responses. Key features include:

- **Multi-Model Support**: Seamlessly switch between DeepSeek, Gemini, Groq, OpenAI, and Claude.
- **Animated UI**: Visually appealing login/register pages with smooth animations.
- **Chat Functionality**: A dynamic chat container with fixed-width bot messages, markdown parsing, and editing capabilities.
- **Chat History**: Persistent storage and management of past conversations.
- **User Management**: Secure authentication and profile updates for name and password.

The backend (assumed to be Node.js/Express) handles authentication, chat history, and AI model integrations, ensuring a secure and scalable experience.

## Features

### 1. Multi-Model AI Interaction
- **Supported Models**:
  - DeepSeek R1
  - Gemini
  - Groq (with LLaMA)
  - OpenAI
  - Claude Sonet
- Users can select a model from a dropdown menu in the chat interface.
- Responses are processed and rendered using a custom markdown parser, supporting:
  - Formatted text (bold, italic, lists, etc.)
  - Code blocks with syntax highlighting
  - Inline links and tables
- Each model’s response is displayed in a fixed 900px-wide panel, ensuring consistent layout regardless of content length.

### 2. User Authentication
- **Animated Login/Register Pages**:
  - Built with React and styled with CSS animations for a modern, engaging experience.
  - Features include fade-ins, slide transitions, and hover effects on buttons.
- **Secure Authentication**:
  - Uses JSON Web Tokens (JWT) for session management.
  - Passwords are hashed (assumed) on the backend for security.
- **Profile Management**:
  - Users can navigate to a `/profile` page to update their name and password.
  - Form validation ensures secure and valid updates.

### 3. Chat Interface
- **Interactive Chat**:
  - Users type messages in a textarea and send them to the selected AI model.
  - Bot responses are displayed in a fixed-width (900px) panel with proper text wrapping (`word-break: break-word`, `overflow-wrap: break-word`).
  - User messages are aligned to the right, with a maximum width of 80% for responsiveness.
- **Message Editing**:
  - Users can edit their messages by clicking an edit icon (`FiEdit2`).
  - Edited messages trigger a new AI response, preserving conversation context.
- **Copy Functionality**:
  - Copy buttons (`FiCopy`) allow users to copy user messages or code blocks in bot responses.
  - A "Copied!" tooltip appears for 2 seconds after copying.
- **Example Prompts**:
  - When no chat is active, the chat container displays four randomized example prompts (e.g., "Explain quantum computing in simple terms").
  - Clicking a prompt sends it to the selected AI model, initiating a conversation.

### 4. Chat History Management
- **Sidebar Navigation**:
  - A collapsible sidebar (toggled via `FiMessageSquare` icon) displays past chat sessions.
  - Each session is represented by a title and supports selection to load messages.
- **Persistent Storage**:
  - Chat history is fetched from the backend (`/api/ai_chat/history`) and stored per user.
  - Each session is assigned a unique `session_id` and `chat_id`.
- **Delete Functionality**:
  - Long-press (500ms) or right-click a chat item to reveal a delete button (`FiTrash2`).
  - Deleting a chat removes it from the backend and updates the UI.

### 5. Responsive and Animated UI
- **Animations**:
  - Sidebar slides in/out with a 0.3s ease transition.
  - Buttons and dropdowns feature hover effects (e.g., background color changes).
  - Login/register pages include CSS animations for a polished look.
- **Responsive Design**:
  - The chat container and input bar adapt to various screen sizes.
  - Mobile-friendly sidebar and chat layout ensure usability on smaller devices.
- **Consistent Styling**:
  - Uses a light color palette (`#f8fafc`, `#ffffff`, `#3b82f6`) for a clean aesthetic.
  - Inline styles ensure modularity and avoid CSS conflicts.

## Technologies

### Frontend
- **React**: Component-based UI library for dynamic rendering.
- **React Router**: Handles routing for pages like `/login`, `/register`, and `/profile`.
- **React Icons**: Provides icons for UI elements (e.g., `FiSend`, `FiPaperclip`).
- **CSS-in-JS**: Inline styles for component-specific styling, reducing global CSS dependencies.
- **Custom Markdown Parser** (`parseMarkdown.js`):
  - Converts AI responses into formatted HTML.
  - Supports code blocks with copy functionality.

### Backend (Assumed)
- **Node.js/Express**: REST API server for handling requests.
- **JWT**: Secure authentication and session management.
- **Database**: MongoDB or PostgreSQL (assumed) for storing user data and chat history.
- **AI Model APIs**:
  - Integrates with DeepSeek, Gemini, Groq, OpenAI, and Claude via their respective APIs.
  - Unified backend endpoint (`/api/ai_chat/request`) routes requests to the appropriate model.

### Development Tools
- **npm/yarn**: Package management for dependencies.
- **ESLint/Prettier** (recommended): Code linting and formatting.
- **Vite/Webpack**: Build tools for React (assumed based on standard React setup).

## Installation

### Prerequisites
- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **Backend Server**: Running with APIs for authentication, chat history, and AI interactions
- **AI API Keys**: For DeepSeek, Gemini, Groq, OpenAI, and Claude, configured in the backend
- **Database**: MongoDB/PostgreSQL for user and chat data (assumed)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mtptisid/Multi-Model-AI-Appliaction-PolyGenAI-with-FastAPI-Vite-React
   cd Multi-Model-AI-Appliaction-PolyGenAI-with-FastAPI-Vite-React
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```
  

4. **Backend Setup**:
   - Set up a Node.js/Express server with the required endpoints (see [API Endpoints](#api-endpoints)).
   - Configure AI API keys in the backend `.env` file:
     ```env
     DEEPSEEK_API_KEY=your_deepseek_key
     GEMINI_API_KEY=your_gemini_key
     GROQ_API_KEY=your_groq_key
     OPENAI_API_KEY=your_openai_key
     CLAUDE_API_KEY=your_claude_key
     DATABASE_URL=your_database_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Ensure the database is running and seeded with user and chat tables/collections.

5. **Run the Application**:
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

6. **Run the Backend**:
   Start the backend server (e.g., `node server.js`) and ensure it’s accessible at the URL specified in `REACT_APP_API_URL`.

## Configuration

### Frontend
- **API URL**: Update `REACT_APP_API_URL` in `.env` to match your backend server.
- **Styling**: Modify `styles` objects in `HomePage.js` and `ChatContainer.js` for custom colors, fonts, or layouts.
- **Example Prompts**: Edit the `examplePrompts` array in `HomePage.js` to add or change prompts.

### Backend
- **Database**: Configure a database (e.g., MongoDB) with collections for:
  - Users: `{ email, password, name }`
  - Chats: `{ user_id, chat_id, title, messages: [{ content, is_bot, timestamp }] }`
- **AI APIs**: Ensure API keys are valid and rate limits are handled.
- **CORS**: Enable CORS for the frontend URL (e.g., `http://localhost:3000`).

## Usage

### User Flow
1. **Register/Login**:
   - Visit `http://localhost:5173` and click "Register" to create an account with email and password.
   - Log in to access the main chat interface (`HomePage.js`).

2. **Start a Chat**:
   - Select an AI model from the bottom-right dropdown (e.g., Gemini).
   - Type a message in the input textarea or click an example prompt (e.g., "How to cook a perfect steak").
   - Press "Enter" or click the send button (`FiSend`) to submit.
   - Bot responses appear in a 900px-wide panel, with markdown formatting for readability.

3. **Manage Conversations**:
   - Toggle the sidebar (`FiMessageSquare`) to view chat history.
   - Click a chat title to load its messages.
   - Click "+ New Chat" to start a fresh session.
   - Long-press a chat item to delete it (red `FiTrash2` button appears).

4. **Edit Messages**:
   - For user messages, click the edit icon (`FiEdit2`) to modify the text.
   - Save changes (`FiCheck`) to update the message and get a new AI response.
   - Cancel editing (`FiX`) to discard changes.

5. **Copy Content**:
   - Click the copy icon (`FiCopy`) on user messages or code blocks to copy content to the clipboard.
   - A "Copied!" tooltip confirms the action.

6. **Profile Updates**:
   - Click the user dropdown (top-right, showing email prefix) and select "Profile".
   - Update name or password and save changes.

### Example Interaction
- **User**: Selects "OpenAI" and types, "Write a Python script for a to-do list app."
- **Bot**: Responds with a markdown-formatted script, including a code block:
  ```python
  # To-Do List App
  tasks = []
  def add_task(task):
      tasks.append(task)
  # ... (more code)
  ```
- **User**: Clicks the copy button to copy the code, edits their message to "Add comments to the script," and receives an updated response.

## API Endpoints

The frontend interacts with the following backend endpoints (based on `HomePage.js`):

| Endpoint | Method | Description | Headers | Body |
|----------|--------|-------------|---------|------|
| `/api/ai_chat/history` | GET | Fetches all chat sessions for the user | `Authorization: Bearer <token>` | - |
| `/api/ai_chat/request` | POST | Sends a message to the selected AI model | `Authorization: Bearer <token>`, `Content-Type: application/json` | `{ content, model, session_id, chat_id }` |
| `/api/ai_chat/:chatId` | DELETE | Deletes a specific chat session | `Authorization: Bearer <token>` | - |
| `/api/auth/register` | POST | Registers a new user | `Content-Type: application/json` | `{ email, password, name }` |
| `/api/auth/login` | POST | Authenticates a user and returns a JWT | `Content-Type: application/json` | `{ email, password }` |
| `/api/user/profile` | PUT | Updates user profile (name, password) | `Authorization: Bearer <token>`, `Content-Type: application/json` | `{ name, password }` |

### Example Request (Send AI Message)
```bash
curl -X POST http://localhost:8000/api/ai_chat/request \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Explain blockchain technology",
    "model": "openai",
    "session_id": 67890,
    "chat_id": null
  }'
```

### Response
```json
{
  "content": "## Blockchain Technology\n\nA blockchain is a decentralized, distributed ledger that records transactions across many computers. This ensures that the record is secure, transparent, and tamper-proof. Key features include:\n\n- **Decentralization**: No single authority controls the blockchain.\n- **Immutability**: Once data is written, it cannot be altered.\n- **Transparency**: All transactions are visible to participants.\n\n### How It Works\n1. A transaction is initiated.\n2. The transaction is broadcast to a network of nodes.\n3. Nodes validate the transaction using consensus algorithms.\n4. The validated transaction is added to a block.\n5. The block is appended to the blockchain and distributed to all nodes.\n\n### Use Cases\n- Cryptocurrencies (e.g., Bitcoin, Ethereum)\n- Supply chain management\n- Smart contracts\n- Healthcare record security\n\n```python\n# Example: Simple blockchain in Python\ndef create_block(data, prev_hash):\n    return {'data': data, 'prev_hash': prev_hash}\n```",
  "session_id": 67890,
  "chat_id": 123
}
```

## Project Structure

### frontend

```
frontend/
├── public/
│   ├── index.html              # HTML entry point
│   ├── favicon.ico             # App favicon
│   └── manifest.json           # Web app manifest
├── src/
│   ├── components/
│   │   ├── HomePage.js         # Main chat interface with sidebar and input
│   │   ├── ChatContainer.js    # Renders messages and example prompts
│   │   ├── Login.js            # Animated login page
│   │   ├── Register.js         # Animated register page
│   │   └── Profile.js          # User profile management
│   ├── context/
│   │   └── AuthContext.js      # Manages user authentication state
│   ├──services
│   │    └──authService.js
│   │    └──chatService.js
│   │ 
│   ├── utils/
│   │   └── parseMarkdown.js    # Parses markdown for AI responses
│   ├── App.js                  # Main app with routing
│   ├── index.js                # React entry point
│   └── styles/                 # (Optional) CSS files if not using inline styles
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies and scripts
├── README.md                   # Project documentation
└── LICENSE                     # License file (e.g., MIT)
```

### backend

```
backend/
└── app
    ├── __pycache__
    │   └── main.cpython-312.pyc
    ├── main.py
    ├── myapp
    │   ├── __init__.py
    │   ├── __pycache__
    │   │   ├── __init__.cpython-312.pyc
    │   │   ├── database.cpython-312.pyc
    │   │   ├── hashing.cpython-312.pyc
    │   │   ├── main.cpython-312.pyc
    │   │   ├── models.cpython-312.pyc
    │   │   ├── oauth2.cpython-312.pyc
    │   │   ├── schemas.cpython-312.pyc
    │   │   └── token.cpython-312.pyc
    │   ├── core
    │   │   ├── __pycache__
    │   │   │   └── config.cpython-312.pyc
    │   │   └── config.py
    │   ├── database.py
    │   ├── hashing.py
    │   ├── models.py
    │   ├── oauth2.py
    │   ├── repository
    │   │   ├── __pycache__
    │   │   │   └── user.cpython-312.pyc
    │   │   └── user.py
    │   ├── routers
    │   │   ├── __init__.py
    │   │   ├── __pycache__
    │   │   │   ├── __init__.cpython-312.pyc
    │   │   │   ├── authentication.cpython-312.pyc
    │   │   │   ├── chat.cpython-312.pyc
    │   │   │   └── user.cpython-312.pyc
    │   │   ├── authentication.py
    │   │   ├── chat.py
    │   │   └── user.py
    │   ├── schemas.py
    │   ├── services
    │   │   ├── __pycache__
    │   │   │   └── ai.cpython-312.pyc
    │   │   └── ai.py
    │   └── token.py
    ├── myapp.db
    └── requirements.txt

12 directories, 33 files
```

## Development Notes

- **Inline Styles**: The project uses inline styles (CSS-in-JS) in `HomePage.js` and `ChatContainer.js` for modularity. Consider migrating to a CSS framework (e.g., Tailwind CSS) for scalability.
- **Markdown Parsing**: The `parseMarkdown.js` utility handles complex markdown, but may need optimization for large responses or additional formats (e.g., images).
- **Error Handling**:
  - Frontend handles API errors by displaying "Error: Failed to get response" in the chat.
  - Backend should implement rate limiting and error logging.
- **Performance**:
  - `useMemo` is used in `ChatContainer.js` to optimize markdown parsing.
  - Consider lazy-loading chat history for users with many sessions.
- **Testing**:
  - Unit tests for components (`HomePage.js`, `ChatContainer.js`) are recommended using Jest/React Testing Library.
  - End-to-end tests with Cypress for user flows (login, chat, profile).

## Future Enhancements

- **Model Comparison**: Allow users to send the same prompt to multiple models and compare responses side-by-side.
- **Real-Time Typing Indicators**: Show when the AI is "typing" during response generation.
- **Chat Export**: Enable users to export chat sessions as text or PDF.
- **Voice Input**: Integrate speech-to-text for sending messages via voice.
- **Dark Mode**: Add a theme toggle for dark/light mode.
- **Advanced Markdown**: Support images, LaTeX, or interactive widgets in responses.
- **Analytics Dashboard**: Track user interactions (e.g., most-used models, prompt frequency) for admins.

## Contributing

We welcome contributions to PolyGenAI! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request with a detailed description of your changes.

Please adhere to the following:
- Follow the existing code style (inline styles, consistent naming).
- Include tests for new features.
- Update documentation (e.g., this README) as needed.

## Screenshots

- Login and Register Pages
  
<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/78171964-6e58-4e01-aa0e-63cfe01d31c8" alt="Image 1" style="width: 48%;"/>
  <img src="https://github.com/user-attachments/assets/3c3ec099-8e24-4a6f-a3c0-2411a07e378d" alt="Image 2" style="width: 48%;"/>
</div>

 - Home Page

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/e35398ec-1369-48b4-a6c4-b68197bb787c" alt="Image 1" style="width: 48%;"/>
  <img src="https://github.com/user-attachments/assets/a2d6deea-6674-42b9-a546-5443e2e3ef32" alt="Image 2" style="width: 48%;"/>
</div>

- Chat Page

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/47905f4f-c2da-45df-bfee-8d220ebb1060" alt="Image 1" style="width: 48%;"/>
  <img src="https://github.com/user-attachments/assets/8cfa0798-9922-49e1-a5cc-137e63a4b2f3" alt="Image 2" style="width: 48%;"/>
</div>


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or support, please contact:
- **Email**: msidrm455@gmail.com
- **GitHub Issues**: [PolyGenAI Issues](https://github.com/mtptisid/Multi-Model-AI-Appliaction-PolyGenAI-with-FastAPI-Vite-Reactissues)

---

**PolyGenAI** - Your one-stop platform for exploring the power of Generative AI.

