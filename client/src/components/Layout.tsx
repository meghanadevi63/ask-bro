import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import { Database, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`fixed top-0 left-0 right-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm h-16 flex items-center px-4 md:px-6`}>
        <div className="flex items-center">
          <Database className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-xl md:text-2xl font-bold">AI Data Agent</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      <div className="pt-16 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};