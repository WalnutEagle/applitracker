import React from 'react';
import { HistoryEntry } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface HistoryPreviewProps {
    entries: HistoryEntry[];
}

const HistoryPreview: React.FC<HistoryPreviewProps> = ({ entries }) => {
    const recentEntries = entries.slice(0, 3);

    if (entries.length === 0) {
        return null; // Don't render the section if there's no history at all
    }

    return (
        <div className="mt-6 animate-fade-in">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">Recent Activity</h3>
            {recentEntries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {recentEntries.map((entry) => {
                        const goalMet = entry.count >= entry.goal;
                        const displayDate = new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC', // Ensure date isn't shifted by local timezone
                        });

                        return (
                            <div key={entry.date} className="bg-gray-800/60 p-3 rounded-xl flex items-center justify-between transition-colors hover:bg-gray-800">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">{displayDate}</p>
                                    <p className="font-bold text-lg text-gray-200">{entry.count} <span className="text-xs text-gray-500">/ {entry.goal}</span></p>
                                </div>
                                {goalMet ? (
                                    <div className="bg-green-500/10 p-2 rounded-full">
                                        <CheckIcon className="h-5 w-5 text-green-400" />
                                    </div>
                                ) : (
                                    <div className="bg-red-500/10 p-2 rounded-full">
                                        <XMarkIcon className="h-5 w-5 text-red-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="bg-gray-800/60 p-4 rounded-xl text-center">
                    <p className="text-sm text-gray-400">No recent activity to show yet. Log an application to get started!</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPreview;
