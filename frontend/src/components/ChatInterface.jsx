import { useState, useEffect } from 'react'
import { getChatHistory, sendMessage } from '../services/chatService'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getChatHistory()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage = { content: input, is_bot: false }
    setMessages(prev => [...prev, newMessage])
    
    try {
      const response = await sendMessage({
        content: input,
        session_id: sessionId || 0
      })
      
      setMessages(prev => [...prev, response])
      setInput('')
      if (!sessionId) setSessionId(response.session_id)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Chat History Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <div className="space-y-2">
          {history.map(session => (
            <div
              key={session.chat_id}
              className="p-2 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => setSessionId(session.chat_id)}
            >
              {session.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 chat-height">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 ${msg.is_bot ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.is_bot ? 'bg-gray-100' : 'bg-primary text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}