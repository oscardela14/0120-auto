
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { CalendarDay } from './CalendarDay';

export const StudioCalendar = ({
    currentDate,
    setCurrentDate,
    calendarDays,
    getEventsForDay,
    handleCalendarDrop,
    handleEventClick,
    handleSaveTemplate
}) => {
    return (
        <div className="bg-surface/30 border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">OSMU 통합 콘텐츠 캘린더</h3>
                        <p className="text-gray-500 text-sm font-medium">자동 생성된 콘텐츠와 예약된 발행 일정을 관리하세요.</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleSaveTemplate}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[18px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5"
                    >
                        <Edit2 size={16} /> 현재 구성 저장
                    </button>
                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-black text-white px-4 uppercase tracking-widest">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.01]">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-black text-gray-500 tracking-[0.2em]">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => (
                    <CalendarDay
                        key={idx}
                        day={day.date}
                        events={getEventsForDay(day.date)}
                        isCurrentMonth={day.isCurrentMonth}
                        onDrop={handleCalendarDrop}
                        onEventClick={handleEventClick}
                    />
                ))}
            </div>
        </div>
    );
};
