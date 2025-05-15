import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Clock, BookMarked, Settings, Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? `${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'}` 
        : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
    }`;

  const sidebarClass = `
    fixed md:static top-16 bottom-0 left-0 z-20
    w-64 md:w-56 lg:w-64 p-4
    transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    transition-transform duration-300 ease-in-out
    ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
    shadow-lg md:shadow-none
  `;

  return (
    <>
      <button 
        className="fixed bottom-4 right-4 md:hidden z-30 p-3 rounded-full bg-blue-600 text-white shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={sidebarClass}>
        <nav className="flex flex-col space-y-2">
          <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/history" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Clock size={20} />
            <span>Query History</span>
          </NavLink>
          <NavLink to="/insights" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <BookMarked size={20} />
            <span>Saved Insights</span>
          </NavLink>
          <NavLink to="/settings" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;