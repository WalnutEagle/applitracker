
import React, { useState, useEffect, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { HistoryEntry, Theme } from '../types';
import { ThemeContext } from '../contexts/ThemeContext';

import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Confetti from './Confetti';
import HistoryCalendar from './HistoryCalendar';

import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { BellIcon } from './icons/BellIcon';
import { BellSlashIcon } from './icons/BellSlashIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import { FireIcon } from './icons/FireIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

interface TrackerDashboardProps {
  onLogout: () => void;
}

const themeOptions: { name: Theme; gradient: string }[] = [
    { name: 'default', gradient: 'from-blue-400 to-teal-400' },
    { name: 'sunset', gradient: 'from-orange-400 to-rose-400' },
    { name: 'graphite', gradient: 'from-gray-400 to-gray-100' },
];

const TrackerDashboard: React.FC<TrackerDashboardProps> = ({ onLogout }) => {
  const [count, setCount] = useLocalStorage<number>(LOCAL_STORAGE_KEYS.COUNT, 0);
  const [goal, setGoal] = useLocalStorage<number>(LOCAL_STORAGE_KEYS.GOAL, 10);
  const [emailEnabled, setEmailEnabled] = useLocalStorage<boolean>(LOCAL_STORAGE_KEYS.EMAIL_NOTIFICATIONS, true);
  const [lastVisitDate, setLastVisitDate] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.LAST_VISIT_DATE, null);
  
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(LOCAL_STORAGE_KEYS.HISTORY, []);
  const [streak, setStreak] = useLocalStorage<number>(LOCAL_STORAGE_KEYS.STREAK, 0);
  const [goalMetToday, setGoalMetToday] = useLocalStorage<boolean>(LOCAL_STORAGE_KEYS.GOAL_MET_TODAY, false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (lastVisitDate && lastVisitDate !== todayStr) {
      // Read directly from localStorage to avoid using stale state from React's closure.
      const lastDayCount = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.COUNT) || '0');
      const lastDayGoal = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.GOAL) || '10');
      const lastDayHistory = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY) || '[]');
      const lastDayStreak = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.STREAK) || '0');
      
      const goalWasMet = lastDayCount >= lastDayGoal;

      const newHistoryEntry: HistoryEntry = { date: lastVisitDate, count: lastDayCount, goal: lastDayGoal };
      const existingIndex = lastDayHistory.findIndex((entry: HistoryEntry) => entry.date === lastVisitDate);
      if (existingIndex > -1) {
          lastDayHistory[existingIndex] = newHistoryEntry;
          setHistory(lastDayHistory);
      } else {
        setHistory([newHistoryEntry, ...lastDayHistory]);
      }
      
      const today = new Date(todayStr);
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastVisitDate === yesterdayStr) {
        setStreak(goalWasMet ? lastDayStreak + 1 : 0);
      } else {
        setStreak(goalWasMet ? 1 : 0);
      }

      if (emailEnabled && !goalWasMet) {
        setNotification(`Goal Missed: On ${lastVisitDate}, you logged ${lastDayCount} of ${lastDayGoal} applications.`);
      }

      setCount(0);
      setGoalMetToday(false);
    }

    setLastVisitDate(todayStr);
  // The dependency array is intentionally empty. This effect should only run once on mount
  // to check the date and handle the transition from a previous day.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (!goalMetToday && newCount >= goal && goal > 0) {
        setShowConfetti(true);
        setGoalMetToday(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleDecrement = () => {
    setCount(prevCount => {
        const newCount = Math.max(0, prevCount - 1);
        
        if (goalMetToday && newCount < goal) {
            setGoalMetToday(false);
        }
        
        return newCount;
    });
  };
  
  const toggleHistory = () => {
      setShowHistory(prev => !prev);
      if(showSettings) setShowSettings(false);
  };

  const toggleSettings = () => {
      setShowSettings(prev => !prev);
      if(showHistory) setShowHistory(false);
  };

  const progress = goal > 0 ? Math.min((count / goal) * 100, 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto">
        <button onClick={onLogout} className="fixed top-4 right-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors z-10" aria-label="Logout">
            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-400"/>
        </button>

        {showConfetti && <Confetti />}
        {notification && (
            <div className="bg-yellow-900/60 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg mb-4 text-sm flex items-center justify-between animate-fade-in">
                <span>{notification}</span>
                <button onClick={() => setNotification(null)} className="font-bold text-xl">&times;</button>
            </div>
        )}
        
        <Card>
            <div className="text-center p-8">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <p className="text-[var(--text-light)] text-sm font-medium uppercase tracking-wider">Applications Sent Today</p>
                    <div className="flex items-center text-orange-400" title={`${streak} day streak`}>
                        <FireIcon className="h-4 w-4" />
                        <span className="font-bold text-sm">{streak}</span>
                    </div>
                </div>

                <div className="text-7xl font-extrabold my-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-teal-300)]">
                    {count}
                </div>
                
                <div className="w-full bg-[var(--secondary-700)]/50 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-400)] h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}>
                  </div>
                </div>
                <p className="text-[var(--text-light)]">Daily Goal: {count} / {goal}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 px-6 pb-6">
                <Button variant="primary" onClick={handleIncrement} className="col-span-3 flex items-center justify-center text-lg py-4">
                    <PlusIcon className="h-6 w-6 mr-2" />
                    <span>Log Application</span>
                </Button>
                 <Button variant="secondary" onClick={handleDecrement} className="col-span-1 flex items-center justify-center text-lg py-4" aria-label="Remove Application">
                    <MinusIcon className="h-6 w-6" />
                </Button>
            </div>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" onClick={toggleHistory} className="w-full flex items-center justify-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                <span>{showHistory ? 'Hide' : 'View'} History</span>
            </Button>
            <Button variant="secondary" onClick={toggleSettings} className="w-full flex items-center justify-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                <span>{showSettings ? 'Hide' : 'Show'} Settings</span>
            </Button>
        </div>

        {showHistory && (
            <div className="mt-6 animate-fade-in">
                 <HistoryCalendar history={history} goal={goal} currentCount={count} />
            </div>
        )}

        {showSettings && (
            <Card className="mt-6 p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">Settings</h3>
                <div className="space-y-4">
                    <Input 
                        label="Set Daily Goal"
                        type="number"
                        id="daily-goal"
                        value={goal}
                        onChange={(e) => setGoal(Math.max(1, parseInt(e.target.value, 10)) || 1)}
                        min="1"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--text-main)]">Email Notifications</span>
                        <button onClick={() => setEmailEnabled(!emailEnabled)} className={`p-2 rounded-full transition-colors ${emailEnabled ? 'bg-[var(--primary-600)]' : 'bg-[var(--secondary-600)]'}`}>
                            {emailEnabled ? <BellIcon className="h-5 w-5"/> : <BellSlashIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                     <div className="pt-2">
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Theme</label>
                        <div className="grid grid-cols-3 gap-2">
                            {themeOptions.map((option, index) => (
                                <button 
                                  key={option.name} 
                                  onClick={() => setTheme(option.name)} 
                                  className={`w-full h-12 rounded-lg transition-all flex items-center justify-center font-semibold text-sm ${option.gradient} ${theme === option.name ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-main)] ring-[var(--text-dark)]' : 'opacity-70 hover:opacity-100'}`}
                                >
                                  <span className={`${option.name === 'graphite' ? 'text-black' : 'text-white'} drop-shadow-sm`}>
                                    Theme {index + 1}
                                  </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-light)] pt-2">
                        *Email notifications are simulated. If your daily goal isn't met, a reminder will appear here the next day.
                    </p>
                </div>
            </Card>
        )}
    </div>
  );
};

export default TrackerDashboard;
