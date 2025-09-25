import { useState } from 'react'
import ChatInput from '@/containers/ChatInput'
import { Button } from '@/components/ui/button'
import { IconMessage, IconX, IconSend } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function IDEChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with code reviews, debugging, explaining concepts, and more. What would you like to work on?',
      timestamp: new Date()
    }
  ])
  const [isExpanded, setIsExpanded] = useState(true)

  // const addMessage = (content: string, role: 'user' | 'assistant') => {
  //   const newMessage: Message = {
  //     id: Date.now().toString(),
  //     role,
  //     content,
  //     timestamp: new Date()
  //   }
  //   setMessages(prev => [...prev, newMessage])
  // }

  // const handleSendMessage = (message: string) => {
  //   addMessage(message, 'user')
    
  //   // Simulate AI response (in real app, this would call the AI service)
  //   setTimeout(() => {
  //     addMessage(
  //       "I'm here to help! Could you please provide more context about what you're working on or what specific assistance you need?",
  //       'assistant'
  //     )
  //   }, 1000)
  // }

  if (!isExpanded) {
    return (
      <div className="h-full flex flex-col bg-background border-r border-border">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <IconMessage size={16} />
            Chat
          </h3>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(true)}
          >
            <IconSend size={12} />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Click to expand chat
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <IconMessage size={16} />
          AI Assistant
        </h3>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0"
          onClick={() => setIsExpanded(false)}
        >
          <IconX size={12} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <ChatInput 
          className="min-h-0"
          showSpeedToken={false}
          initialMessage={false}
        />
      </div>
    </div>
  )
}