import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Leaf } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useAuth } from '../utils/auth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PlantPalChatProps {
  plantName?: string;
  plantSpecies?: string;
  initialMessage?: string;
  onSendMessage?: (message: string, history: ChatMessage[]) => Promise<string>;
  className?: string;
}

export const PlantPalChat: React.FC<PlantPalChatProps> = ({
  plantName,
  plantSpecies,
  initialMessage = "Hi! I'm PlantPal, your plant care assistant. How can I help you with your plant today?",
  onSendMessage,
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const { plantId } = useParams<{ plantId: string }>();
  const [plant, setPlant] = useState<string>(plantId || '');

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const token = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendRequest(plantId: string, message: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include", 
      body: JSON.stringify({ plantId, message }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to send message");
    }

    const response = await res.json();
    console.log("Chat API response:", response);
    return response;
  }


  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: plant,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };


    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {      
     
      // Call Chat Handler
      const data = await sendRequest(plant, userMessage.content);
      const responseContent = data || "No response received";  // Handle different response formats
      

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent.answer,
        timestamp: new Date()
      };

      console.log("Assistant message:", assistantMessage);

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className={`flex flex-col h-full bg-gray-800 rounded-xl border border-green-900/30 overflow-hidden ${className}`}>
      {/* Chat Header */}
      {(plantName || plantSpecies) && (
        <div className="bg-gray-800/80 border-b border-green-900/30 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-900/50 rounded-full flex items-center justify-center border border-emerald-600/30">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              {plantName && (
                <h3 className="font-semibold text-emerald-100" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
                  {plantName}
                </h3>
              )}
              {plantSpecies && (
                <p className="text-sm text-emerald-300/70 italic">{plantSpecies}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-600/20 scrollbar-track-transparent"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? 'bg-emerald-600' 
                : 'bg-gray-700 border border-emerald-600/30'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Leaf className="w-4 h-4 text-emerald-400" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                    : 'bg-gray-700 text-gray-100 border border-green-900/30'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700 border border-emerald-600/30">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="bg-gray-700 text-gray-100 border border-green-900/30 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800/80 border-t border-green-900/30 px-6 py-4 backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about watering, sunlight, care tips..."
            rows={1}
            className="flex-1 px-4 py-3 bg-gray-700 border border-green-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500 resize-none transition-all"
            style={{ maxHeight: '150px' }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-3 rounded-full hover:from-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-500/30 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick suggestions component (optional)
interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-emerald-200 text-sm rounded-full border border-green-800/50 hover:border-emerald-600/50 transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};