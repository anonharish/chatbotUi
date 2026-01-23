import { MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
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

      <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            AI Assistant is online
          </div>
          <p className="text-card-foreground">
            Hello! I'm your AI assistant. How can I help you today?
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-semibold">💬 Natural Conversations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Engage in fluid, human-like conversations
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-semibold">⚡ Fast Responses</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get instant, accurate answers to your queries
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-semibold">🔒 Secure & Private</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your conversations are safe and confidential
          </p>
        </div>
      </div>
    </div>
  )
}
