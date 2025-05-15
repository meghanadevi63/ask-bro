import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Database, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h2 className="text-xl font-medium mb-4">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Theme</label>
            <p className="text-sm text-gray-500">Choose between light and dark mode</p>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`
              p-3 rounded-lg transition-colors flex items-center gap-2
              ${theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={18} className="text-yellow-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} className="text-blue-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h2 className="text-xl font-medium mb-4">Database Connection</h2>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Database size={18} className="text-green-500" />
            <span className="font-medium">Connected to: Sample Business Database</span>
          </div>
          <p className="text-sm text-gray-500 ml-6">Using PostgreSQL database with sample business data</p>
        </div>
        
        <button
          className={`
            px-4 py-2 rounded-md transition-colors flex items-center gap-2
            ${theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'}
          `}
        >
          <RefreshCw size={16} />
          <span>Test Connection</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;