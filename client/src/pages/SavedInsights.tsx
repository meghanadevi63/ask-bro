import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookMarked } from 'lucide-react';

// This is a placeholder component for saved insights
// In a real application, this would have its own context and data management
const SavedInsights: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Insights</h1>
      
      <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <BookMarked size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">No Saved Insights</h3>
        <p className="text-gray-500">Your saved insights will appear here. Click the save button on any insights you want to reference later.</p>
      </div>
    </div>
  );
};

export default SavedInsights;