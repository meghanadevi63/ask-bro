import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useQueryHistory } from '../context/QueryHistoryContext';
import { useChat } from '../context/ChatContext';
import { ArrowRight, Clock, Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const { theme } = useTheme();
  const { history, removeFromHistory, clearHistory } = useQueryHistory();
  const { sendMessage } = useChat();

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleRerunQuery = (question: string) => {
    sendMessage(question);
    // Navigate to dashboard
    window.location.href = '/';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Query History</h1>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className={`
              px-3 py-1 text-sm rounded-md transition-colors
              ${theme === 'dark' 
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'}
            `}
          >
            <Trash2 size={16} className="inline mr-1" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <Clock size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No Queries Yet</h3>
          <p className="text-gray-500">Your query history will appear here once you start asking questions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div 
              key={item.id}
              className={`
                p-4 rounded-lg shadow-sm transition-all duration-200
                ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}
                border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium mb-1">{item.question}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDate(item.timestamp)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRerunQuery(item.question)}
                    className={`
                      p-2 rounded-md transition-colors
                      ${theme === 'dark' 
                        ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
                    `}
                    title="Run this query again"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className={`
                      p-2 rounded-md transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                    title="Delete from history"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;