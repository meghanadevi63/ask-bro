import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        relative rounded-xl p-2 
        ${theme === 'dark' ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md border border-gray-200'}
      `}
    >
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your data..."
          className={`
            w-full resize-none outline-none py-3 px-4 max-h-32 overflow-y-auto
            rounded-lg text-base
            ${theme === 'dark' ? 'bg-gray-700 text-white placeholder:text-gray-400' : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'}
          `}
          rows={1}
        />
        <button
          type="submit"
          className={`
            ml-2 p-3 rounded-lg transition-colors
            ${message.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
            text-white flex-shrink-0
          `}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs mt-2 text-center text-gray-500">
        Try questions like "What's our revenue trend?" or "Compare sales by region"
      </p>
    </form>
  );
};

export default ChatInput;