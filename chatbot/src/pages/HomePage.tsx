import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";

export default function HomePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to ChatBot UI
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Your intelligent conversational assistant. Start a conversation and experience
            the power of AI-driven communication.
          </p>
        </div>

        {/* Open Chatbot Button */}
        <Button
          size="lg"
          onClick={() => setIsChatbotOpen(true)}
          className="bg-[#249563] hover:bg-[#1f8156] text-white gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          Open AI Assistant
        </Button>
      </div>

      {/* Floating Chat Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#249563] hover:bg-[#1f8156] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
          title="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot Panel */}
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </>
  );
}
