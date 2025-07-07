
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import TrackerDashboard from './components/TrackerDashboard';
import { USER_CREDENTIALS } from './constants';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback((username: string, password) => {
    if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError("Invalid username or password. Please try again.");
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-4 font-sans transition-colors duration-300">
        {isLoggedIn ? (
          <TrackerDashboard onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} error={error} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;