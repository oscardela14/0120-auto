
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const CalendarDay = ({ day, events, isCurrentMonth, onDrop, onEventClick }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(day, data);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-24 p-2 border-r border-b border-white/5 transition-all ${!isCurrentMonth ? 'bg-white/5 text-gray-600' : 'bg-surface/20'
                } ${isDragOver ? 'bg-primary/20 border-primary' : ''}`}
        >
            <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-600' : 'text-white'}`}>
                {day.getDate()}
            </div>
            <div className="space-y-1">
                {events.map((event, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => onEventClick(event)}
                        className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${event.type === 'completed' ? 'opacity-60 grayscale-[0.2]' : 'ring-1 ring-white/20'
                            } ${event.platform === 'YouTube Shorts' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                event.platform === 'Instagram Reels' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                                    event.platform === 'Naver Blog' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}
                    >
                        {event.type === 'completed' && <CheckCircle2 size={10} />}
                        {event.platform === 'YouTube Shorts' && '📺'}
                        {event.platform === 'Instagram Reels' && '📸'}
                        {event.platform === 'Naver Blog' && '📝'}
                        {event.platform === 'Threads' && '💬'}
                        <span className="truncate">{event.data.topic}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
