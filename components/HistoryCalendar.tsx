
import React, { useState, useMemo } from 'react';
import { HistoryEntry } from '../types';
import Card from './ui/Card';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface HistoryCalendarProps {
  history: HistoryEntry[];
  goal: number;
  currentCount: number;
}

// Centralize date logic for clarity and maintainability
const RECORDS_AVAILABLE_START_DATE = new Date('2025-07-01T00:00:00Z');
const VISUALS_START_DATE = new Date('2025-07-02T00:00:00Z');


const HistoryCalendar: React.FC<HistoryCalendarProps> = ({ history, goal, currentCount }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const historyMap = useMemo(() => {
    return history.reduce((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {} as Record<string, HistoryEntry>);
  }, [history]);

  const getSelectedInfo = (): string | null => {
      if (!selectedDate) return null;

      const now = new Date();
      // This is midnight UTC on the user's current local day. This is the key to correct comparison.
      const todayUTCStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

      // This is midnight UTC on the day the user clicked.
      const clickedDateUTCStart = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
      
      const dateStrForHistory = clickedDateUTCStart.toISOString().split('T')[0];
      const displayDate = new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });

      // Handle today's date first for real-time updates
      if (clickedDateUTCStart.getTime() === todayUTCStart.getTime()) {
           if (clickedDateUTCStart >= RECORDS_AVAILABLE_START_DATE) {
              return `Today (${displayDate}): ${currentCount} / ${goal} applications logged.`;
           }
      }

      if (clickedDateUTCStart > todayUTCStart) {
        return `No records yet for ${displayDate}.`;
      }
      if (clickedDateUTCStart < RECORDS_AVAILABLE_START_DATE) {
        return `No records available for ${displayDate}.`;
      }
      
      const historyEntry = historyMap[dateStrForHistory];
      if (historyEntry) {
        return `On ${displayDate}: ${historyEntry.count} / ${historyEntry.goal} applications logged.`;
      }
      
      return `On ${displayDate}: 0 / ${goal} applications logged.`;
  }

  const handleDayClick = (dateToSelect: Date) => {
    const newDate = new Date(dateToSelect); // Create a new Date object to avoid mutation issues
    // If the clicked day is not in the currently viewed month, change the month
    if (newDate.getMonth() !== currentDate.getMonth()) {
        setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
    setSelectedDate(newDate);
  };

  const renderHeader = () => {
    const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    return (
      <div className="flex items-center justify-between px-2 mb-4">
        <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-[var(--secondary-600)] transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-[var(--text-dark)]">{month}</h3>
        <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-[var(--secondary-600)] transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };
  
  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-light)] mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay()); // Start from the Sunday of the first week

    const now = new Date();
    const todayStr = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().split('T')[0];

    const cells = [];
    for (let i = 0; i < 42; i++) {
        const loopDate = new Date(startDate);
        loopDate.setDate(startDate.getDate() + i);

        const dayStr = new Date(Date.UTC(loopDate.getFullYear(), loopDate.getMonth(), loopDate.getDate())).toISOString().split('T')[0];
        const dayForCompare = new Date(loopDate);
        dayForCompare.setUTCHours(0,0,0,0);
        
        const isToday = dayStr === todayStr;
        const isCurrentMonth = loopDate.getMonth() === currentDate.getMonth();
        const isSelected = selectedDate && loopDate.toDateString() === selectedDate.toDateString();
        
        const historyEntry = historyMap[dayStr];
        let goalMet = false;
        let showVisuals = false;

        if (isToday) {
            if (dayForCompare >= VISUALS_START_DATE) {
                goalMet = currentCount >= goal;
                showVisuals = true;
            }
        } else if (historyEntry) {
            if (dayForCompare >= VISUALS_START_DATE) {
                goalMet = historyEntry.count >= historyEntry.goal;
                showVisuals = true;
            }
        }

        cells.push(
            <div key={loopDate.toString()} className="flex items-center justify-center h-12">
                <button
                    onClick={() => handleDayClick(loopDate)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 text-sm relative
                    ${isCurrentMonth ? 'text-[var(--text-main)] hover:bg-[var(--secondary-600)]' : 'text-[var(--text-light)]/40 hover:bg-[var(--secondary-700)]/50'}
                    ${isSelected ? 'bg-[var(--secondary-600)] ring-2 ring-offset-2 ring-offset-[var(--bg-card)] ring-[var(--accent-400)]' : ''}
                    `}
                >
                    <span className="relative z-10">{loopDate.getDate()}</span>
                    {showVisuals && (
                        <>
                            <div className={`absolute inset-0.5 rounded-full border-2 ${goalMet ? 'border-emerald-500' : 'border-rose-500'}`}></div>
                            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 z-20">
                                {goalMet 
                                    ? <CheckIcon className="w-4 h-4 text-emerald-400 bg-[var(--bg-card)] rounded-full p-0.5" />
                                    : <XMarkIcon className="w-4 h-4 text-rose-400 bg-[var(--bg-card)] rounded-full p-0.5" />
                                }
                            </div>
                        </>
                    )}
                </button>
            </div>
        );
    }
    return <div className="grid grid-cols-7 gap-y-1">{cells}</div>;
  };

  const selectedInfo = getSelectedInfo();
  
  return (
     <Card className="p-4">
        {renderHeader()}
        {renderDaysOfWeek()}
        {renderCells()}
        {selectedInfo && (
            <div className="mt-4 text-center p-3 bg-[var(--secondary-700)] rounded-lg text-sm animate-fade-in min-h-[44px]">
                <p className="font-medium">{selectedInfo}</p>
            </div>
        )}
     </Card>
  );
};

export default HistoryCalendar;
