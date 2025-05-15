// import React from 'react';
import { Layout } from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { QueryHistoryProvider } from './context/QueryHistoryContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import SavedInsights from './pages/SavedInsights';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <QueryHistoryProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/insights" element={<SavedInsights />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </QueryHistoryProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;