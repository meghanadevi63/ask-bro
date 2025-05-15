import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Message } from '../types/chat';
import Visualization from './Visualization';
import ResultsTable from './ResultsTable';
import { Bookmark, Database, Share2, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const isUser = message.role === 'user';

  const formatTimestamp = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(timestamp);
  };

  return (
    <div 
      className={`
        mb-4 transition-all duration-300 ease-out
        ${isUser ? 'ml-auto' : 'mr-auto'}
        max-w-3xl w-full
      `}
    >
      <div className="flex gap-2 items-start">
        {/* Avatar */}
        <div 
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser 
              ? `${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-100'}`
              : `${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-100'}`
            }
          `}
        >
          {isUser 
            ? <User size={16} className={theme === 'dark' ? 'text-white' : 'text-blue-600'} />
            : <Database size={16} className={theme === 'dark' ? 'text-white' : 'text-purple-600'} />
          }
        </div>

        {/* Message content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">
              {isUser ? 'You' : 'AI Data Agent'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          <div 
            className={`
              p-3 rounded-lg
              ${isUser 
                ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'}`
                : `${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'}`
              }
            `}
          >
            <p className={`whitespace-pre-wrap ${isUser ? '' : 'mb-2'}`}>{message.content}</p>
            
            {/* Visualizations for AI responses */}
            {!isUser && message.visualizations && message.visualizations.length > 0 && (
              <div className="mt-4">
                {message.visualizations.map((viz, index) => (
                  <Visualization key={index} data={viz} />
                ))}
              </div>
            )}

            {/* Data table for AI responses */}
            {!isUser && message.data && (
              <div className="mt-4 overflow-x-auto">
                <ResultsTable data={message.data} />
              </div>
            )}
          </div>

          {/* Action buttons for AI responses */}
          {!isUser && (
            <div className="flex mt-2 gap-2">
              <button 
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Bookmark size={14} />
                <span>Save</span>
              </button>
              <button 
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;