// API configuration for chatbot
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const CHATBOT_API_ENDPOINTS = {
  WEBHOOK: `${API_BASE_URL}/api/chatbot/webhook`,
  CHAT: `${API_BASE_URL}/api/chatbot/chat`,
} as const;
