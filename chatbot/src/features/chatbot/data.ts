export const CHATBOT_CONFIG = {
  title: "AI Assistant",
  welcomeMessage: {
    title: "You can talk to me, ask questions and perform tasks with text commands.",
    features: [
      "I can generate dynamic data analytics dashboards customized to your needs.",
      "I can help you with jobs, queries and any tasks you would like to create, execute or assign.",
      "I can scan and analyze your data and provide you with all the answers.",
    ],
  },
  inputPlaceholder: "Ask me anything...",
  aiName: "AI Assistant",
  typingText: "AI is thinking...",
};

// Mock data for chatbot testing
export const USE_MOCK_DATA = true;

export const MOCK_CHAT_RESPONSE = {
  reply: "Here are the patient claims data you requested. The table below shows the claim ID, patient name, amount, status, and date for each record.",
  rows: [
    { claim_id: "CLM001", patient_name: "John Doe", amount: 1250.00, status: "Approved", date: "2026-01-15" },
    { claim_id: "CLM002", patient_name: "Jane Smith", amount: 850.50, status: "Pending", date: "2026-01-18" },
    { claim_id: "CLM003", patient_name: "Robert Johnson", amount: 2100.75, status: "Approved", date: "2026-01-20" },
    { claim_id: "CLM004", patient_name: "Emily Davis", amount: 450.25, status: "Denied", date: "2026-01-21" },
    { claim_id: "CLM005", patient_name: "Michael Brown", amount: 1875.00, status: "Approved", date: "2026-01-22" },
  ]
};

export const MOCK_INITIAL_RESPONSE = {
  reply: "Hello! I'm your AI Assistant. I can help you with:\n\n• Data analytics and reporting\n• Creating and managing tasks\n• Answering questions about your data\n\nHow can I assist you today?"
};

export const MOCK_RESPONSES: Record<string, { reply: string; rows?: Record<string, unknown>[] }> = {
  "hello": {
    reply: "Hello! How can I help you today?"
  },
  "claims": MOCK_CHAT_RESPONSE,
  "show claims": MOCK_CHAT_RESPONSE,
  "patient data": {
    reply: "Here is the patient demographic data:",
    rows: [
      { patient_id: "P001", name: "John Doe", age: 45, gender: "Male", insurance: "Blue Cross" },
      { patient_id: "P002", name: "Jane Smith", age: 32, gender: "Female", insurance: "Aetna" },
      { patient_id: "P003", name: "Robert Johnson", age: 58, gender: "Male", insurance: "United" },
    ]
  },
  "analytics": {
    reply: "Based on your data analysis request, here are the key metrics:\n\n📊 Total Claims: 1,247\n💰 Total Amount: $2.5M\n✅ Approval Rate: 78%\n⏱️ Avg Processing Time: 3.2 days"
  },
  "help": {
    reply: "I can help you with the following:\n\n1. **Claims Management** - View, search, and analyze claims\n2. **Patient Data** - Access patient information and records\n3. **Analytics** - Generate reports and insights\n4. **Task Management** - Create and track tasks\n\nJust type your request and I'll assist you!"
  }
};

// Function to get mock response based on user input
export function getMockResponse(input: string): { reply: string; rows?: Record<string, unknown>[] } {
  const lowerInput = input.toLowerCase().trim();
  
  // Check for exact matches first
  if (MOCK_RESPONSES[lowerInput]) {
    return MOCK_RESPONSES[lowerInput];
  }
  
  // Check for partial matches
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }
  
  // Default response
  return {
    reply: `I understood your request: "${input}"\n\nThis is a simulated response. In production, this would connect to the AI backend to process your query and return relevant data.`
  };
}
