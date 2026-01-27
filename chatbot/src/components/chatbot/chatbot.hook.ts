import { useState, useRef, useEffect } from "react";
import { USE_MOCK_DATA, MOCK_INITIAL_RESPONSE, getMockResponse } from "@/constants/ChatbotData";
import { CHATBOT_API_ENDPOINTS } from "@/config/api";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface MessageContent {
  text?: string;
  reply?: string;
  rows?: Record<string, unknown>[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | MessageContent;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize speech recognition and send initial message
  useEffect(() => {
    // Setup speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (event: { results: Iterable<{ 0: { transcript: string } }> }) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInputValue((prev) => prev + transcript);
        };
      }
    }

    // Initialize chatbot with greeting
    initializeChatbot();
  }, []);

  const initializeChatbot = async () => {
    setIsTyping(true);

    try {
      let data: { reply?: string; rows?: Record<string, unknown>[] };

      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        data = MOCK_INITIAL_RESPONSE;
      } else {
        const payload = { user_id: 2, message: "Hello" };
        const response = await fetch(CHATBOT_API_ENDPOINTS.WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await response.json();
      }

      if (data) {
        processAssistantResponse(data, "1");
      }
    } catch (err) {
      console.error("Error calling initial API:", err);
      setIsTyping(false);
      // Show error message
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you today?",
        },
      ]);
    }
  };

  const processAssistantResponse = (
    data: { reply?: string; rows?: Record<string, unknown>[] },
    messageId: string
  ) => {
    const hasReply = !!data.reply;
    const hasRows = !!data.rows;

    if (hasReply) {
      setTypingMessageId(messageId);
      setTypingText("");
      setIsTyping(false);

      // Add empty message that will be typed into
      setMessages((prev) => {
        const existingMessage = prev.find((m) => m.id === messageId);
        if (existingMessage) {
          return prev.map((m) => (m.id === messageId ? { ...m, content: "" } : m));
        }
        return [...prev, { id: messageId, role: "assistant" as const, content: "" }];
      });

      let charIndex = 0;
      const fullText = data.reply!;

      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      typingIntervalRef.current = setInterval(() => {
        if (charIndex <= fullText.length) {
          const partial = fullText.slice(0, charIndex);
          setTypingText(partial);
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, content: partial } : m))
          );
          charIndex++;
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          // Set final content with rows if available
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    content: hasRows
                      ? { text: fullText, rows: data.rows! }
                      : fullText,
                  }
                : m
            )
          );
          setTypingMessageId(null);
        }
      }, 20);
    } else if (hasRows) {
      setMessages((prev) => [
        ...prev,
        { id: messageId, role: "assistant", content: { rows: data.rows } },
      ]);
      setIsTyping(false);
      setTypingMessageId(null);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

  const callChatAPI = async (messageToSend: string) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return getMockResponse(messageToSend);
    }

    try {
      const payload = { user_id: 2, message: messageToSend };
      const response = await fetch(CHATBOT_API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (err) {
      console.error("Error calling chat API:", err);
      throw err;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await callChatAPI(messageToSend);
      if (data) {
        const messageId = (Date.now() + 1).toString();
        processAssistantResponse(data, messageId);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    }
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isListening,
    isTyping,
    typingText,
    typingMessageId,
    messagesEndRef,
    handleSend,
    handleMicClick,
    handleKeyPress,
  } as const;
}
