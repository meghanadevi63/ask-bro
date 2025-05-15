import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QueryHistoryItem } from '../types/history';

interface QueryHistoryContextType {
  history: QueryHistoryItem[];
  addToHistory: (item: QueryHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const QueryHistoryContext = createContext<QueryHistoryContextType | undefined>(undefined);

export const QueryHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<QueryHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert string timestamps back to Date objects
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing query history from localStorage:', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Save history to localStorage whenever it changes
    localStorage.setItem('queryHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (item: QueryHistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <QueryHistoryContext.Provider 
      value={{ 
        history, 
        addToHistory, 
        removeFromHistory, 
        clearHistory 
      }}
    >
      {children}
    </QueryHistoryContext.Provider>
  );
};

export const useQueryHistory = (): QueryHistoryContextType => {
  const context = useContext(QueryHistoryContext);
  if (context === undefined) {
    throw new Error('useQueryHistory must be used within a QueryHistoryProvider');
  }
  return context;
};