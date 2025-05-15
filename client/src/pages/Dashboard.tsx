import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { useQueryHistory } from '../context/QueryHistoryContext';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
// import Visualization from '../components/Visualization';
import { AlertTriangle, Lightbulb } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { messages, isLoading, sendMessage } = useChat();
  const { addToHistory } = useQueryHistory();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample suggestions for users to try
  const suggestions = [
    "What were our top 5 selling products last quarter?",
    "Show me the monthly revenue trend for the past year",
    "Which regions have the highest customer churn rate?",
    "Compare sales performance across different customer segments",
    "What's the correlation between marketing spend and new customer acquisition?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
    addToHistory({
      id: Date.now().toString(),
      question: message,
      timestamp: new Date(),
      successful: true
    });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">
      {/* Welcome message for new users */}
      {messages.length === 0 && (
        <div className={`mb-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className="text-2xl font-bold mb-3">Welcome to AI Data Agent</h2>
          <p className="mb-4">Ask complex business questions about your data and get instant insights with visualizations.</p>
          
          <div className="flex items-start gap-2 mb-3 text-amber-600">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">This is a demo environment. The system is connected to a sample business database.</p>
          </div>
        </div>
      )}

      {/* Chat messages area */}
      <div className={`flex-1 overflow-y-auto px-2 ${messages.length === 0 ? 'py-0' : 'py-4'} rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-sm`}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg max-w-3xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} my-2 ml-auto animate-pulse`}>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        {/* For auto-scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions for new users */}
      {showSuggestions && messages.length === 0 && (
        <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-blue-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={20} className={theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'} />
            <h3 className="font-medium">Try asking one of these questions:</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-100'
                } shadow-sm`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Dashboard;