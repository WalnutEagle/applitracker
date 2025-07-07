import React from 'react';
import { HistoryEntry } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface HistoryLogProps {
  history: HistoryEntry[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  if (history.length === 0) {
    return <p className="text-gray-400 text-sm">No history yet. Your daily progress will appear here.</p>;
  }

  return (
    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {history.map((entry, index) => {
        const goalMet = entry.count >= entry.goal;
        const displayDate = new Date(entry.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
        });
        return (
          <li key={index} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center">
              {goalMet ? (
                 <CheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
              ) : (
                 <XMarkIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-gray-200">{displayDate}</p>
                <p className="text-sm text-gray-400">
                  Logged: {entry.count} / {entry.goal}
                </p>
              </div>
            </div>
            <span className={`font-bold text-xs px-2 py-1 rounded-full ${goalMet ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {goalMet ? 'Goal Met' : 'Missed'}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default HistoryLog;
