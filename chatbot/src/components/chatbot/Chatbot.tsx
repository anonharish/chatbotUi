import { X, Mic, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TypingIndicator } from "./TypingIndicator";
import { useChatbot, type MessageContent } from "./chatbot.hook";
import { DataTable } from "@/components/DataTable/DataTable";

function DynamicTableFromRows({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows || rows.length === 0) return null;

  const keys = Object.keys(rows[0]);
  const columns = keys.map((key) => ({
    key: key as keyof (typeof rows)[0],
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const idKey = keys[0] || "";

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto">
      <DataTable
        data={rows}
        columns={columns}
        idKey={idKey}
        searchEnabled={false}
      />
    </div>
  );
}

interface ChatbotProps {
  onClose: () => void;
}

export function Chatbot({ onClose }: ChatbotProps) {
  const {
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
  } = useChatbot();

  const isMessageContent = (content: string | MessageContent): content is MessageContent => {
    return typeof content === "object" && content !== null;
  };

  return (
    <Card className="fixed inset-0 z-[10000] flex w-full min-w-80 flex-col border-0 border-r rounded-none p-0 h-screen bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-border bg-background p-4 h-16">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="overflow-y-auto">
      <div className="flex-1  p-4 space-y-4 max-w-[60%] m-auto">
        {/* Welcome Section */}
        {messages.length <= 1 && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-green-500 flex items-center justify-center shadow-lg">
              <Bot className="h-12 w-12 text-white" />
            </div>
            <div className="text-sm flex flex-col justify-start items-center max-w-md">
              <p className="text-muted-foreground text-center mb-4">
                You can talk to me, ask questions and perform tasks with text commands.
              </p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-2">
                <li>
                  <p className="text-sm">
                    I can generate dynamic data analytics dashboards customized to your needs.
                  </p>
                </li>
                <li>
                  <p className="text-sm">
                    I can help you with jobs, queries and any tasks you would like to create, execute or assign.
                  </p>
                </li>
                <li>
                  <p className="text-sm">
                    I can scan and analyze your data and provide you with all the answers.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Avatar for assistant */}
            {message.role === "assistant" && (
              <div className="flex items-center gap-2">
                <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-sm">
                  🤖
                </div>
                <span className="text-xs text-muted-foreground">AI Assistant</span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {typingMessageId === message.id ? (
                <p className="text-sm whitespace-pre-wrap">{typingText}</p>
              ) : isMessageContent(message.content) ? (
                <div className="space-y-4 max-w-full overflow-hidden">
                  {/* Reply/Text section */}
                  {(message.content.text || message.content.reply) && (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content.text ?? message.content.reply}
                    </p>
                  )}

                  {/* Table section */}
                  {message.content.rows && message.content.rows.length > 0 && (
                    <>
                      <hr className="border-t border-border my-4" />
                      <DynamicTableFromRows rows={message.content.rows} />
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{String(message.content)}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-sm">
              🤖
            </div>
            <div className="bg-muted rounded-lg">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-background p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-muted/50"
            style={{
              boxShadow: "0px 0px 20px 0px rgba(36, 149, 99, 0.2)",
            }}
          />
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={handleMicClick}
            title="Use microphone"
            className="h-9 w-9"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            title="Send message"
            className="h-9 w-9 bg-[#249563] hover:bg-[#1f8156] text-white rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
