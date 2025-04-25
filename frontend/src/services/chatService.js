import axios from 'axios'

const API_URL = '/api/ai_chat'

export const getChatHistory = async () => {
  const response = await axios.get(`${API_URL}/history`)
  return response.data
}

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/request`, messageData)
  return response.data
}