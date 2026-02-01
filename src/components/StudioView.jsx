
import React, { useState, useEffect, useMemo } from 'react';
import { Youtube, Instagram, BookOpen, MessageCircle, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateContent, PERSONAS } from '../utils/contentGenerator';
import { getPlatformStats } from '../utils/swarmEngine';
import { PreviewModal } from './PreviewModal';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';

// Sub-components
import { StudioHeader } from './studio/StudioHeader';
import { StudioStats } from './studio/StudioStats';
import { StudioGenerator } from './studio/StudioGenerator';
import { StudioResults } from './studio/StudioResults';
import { StudioCalendar } from './studio/StudioCalendar';
import { AIBriefingBox } from './studio/AIBriefingBox';
import { TemplateModal } from './studio/TemplateModal';

export const StudioView = ({ history = [], isAuthenticated, onRequireAuth }) => {
    const navigate = useNavigate();
    const { activeResult, setActiveResult, addToHistory, addNotification, user } = useUser();

    // --- State Management ---
    const [mode, setMode] = useState('single');
    const [topic, setTopic] = useState('');
    const [batchTopics, setBatchTopics] = useState(['', '', '', '', '']);
    const [selectedPersona, setSelectedPersona] = useState('witty');
    const [isGenerating, setIsGenerating] = useState(false);
    const [platformContents, setPlatformContents] = useState({
        'YouTube Shorts': null,
        'Instagram Reels': null,
        'Naver Blog': null,
        'Threads': null
    });
    const [batchContents, setBatchContents] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduledEvents, setScheduledEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [templates, setTemplates] = useState([
        { id: 1, name: '바이럴 포맷', persona: 'witty', platforms: 4, usage: 12 },
        { id: 2, name: '전문가 분석', persona: 'analytical', platforms: 4, usage: 8 }
    ]);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const platforms = [
        { name: 'YouTube Shorts', icon: Youtube, color: 'bg-red-500' },
        { name: 'Instagram Reels', icon: Instagram, color: 'bg-pink-500' },
        { name: 'Naver Blog', icon: BookOpen, color: 'bg-green-500' },
        { name: 'Threads', icon: MessageCircle, color: 'bg-gray-500' }
    ];

    // --- Side Effects ---
    useEffect(() => {
        if (activeResult) {
            setTopic(activeResult.topic);
            if (activeResult.platform) {
                setPlatformContents(prev => ({ ...prev, [activeResult.platform]: activeResult }));
            }
        }
    }, [activeResult]);

    // --- Memoized Values ---
    const recommendedTags = useMemo(() => {
        const defaults = ['#급상승', '#꿀팁', '#트렌드', '#정보', '#이슈', '#추천', '#필독', '#인사이트', '#공유', '#소통'];
        if (!topic) return defaults;
        const keyword = topic.split(' ')[0] || '정보';
        return [`#${keyword}`, `#${keyword}팁`, `#${keyword}추천`, `#${keyword}정보`, '#필수', '#트렌드', '#꿀팁', '#정보공유', '#인사이트', '#공감'];
    }, [topic]);

    // --- Handlers ---
    const handleAddTag = (tag) => {
        if (!topic.includes(tag)) setTopic(prev => prev ? `${prev} ${tag}` : tag);
    };

    const handleGenerateAll = async () => {
        if (!isAuthenticated) return onRequireAuth();
        if (!topic.trim()) return addNotification("주제를 입력해주세요.", "warning");

        setIsGenerating(true);
        try {
            const contents = {};
            await Promise.all(platforms.map(async ({ name }) => {
                contents[name] = await generateContent(name, topic, selectedPersona);
            }));
            const creationTime = new Date().toISOString();
            const resultRecord = { id: Date.now(), topic, platform: 'Multi-OSMU', contents, createdAt: creationTime, persona: selectedPersona };

            setPlatformContents(contents);
            await addToHistory(resultRecord);
            setActiveResult(resultRecord);
            addNotification("콘텐츠가 생성되어 보관함에 저장되었습니다.", "success");
        } catch (error) {
            console.error("Batch generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBatchGenerate = async () => {
        if (!isAuthenticated) return onRequireAuth();
        const validTopics = batchTopics.filter(t => t.trim());
        if (validTopics.length === 0) return addNotification("주제를 입력해주세요.", "warning");

        setIsGenerating(true);
        try {
            const allContents = [];
            const batchCreationTime = new Date().toISOString();

            await Promise.all(validTopics.map(async (topicText) => {
                const topicContents = {};
                await Promise.all(platforms.map(async ({ name }) => {
                    topicContents[name] = await generateContent(name, topicText, selectedPersona);
                }));
                const item = { topic: topicText, contents: topicContents, id: Date.now() + Math.random() };
                allContents.push(item);

                await addToHistory({
                    ...item,
                    platform: 'Multi-OSMU (Batch)',
                    createdAt: batchCreationTime,
                    persona: selectedPersona
                });
            }));
            setBatchContents(allContents);
            addNotification(`${allContents.length}개의 주제에 대한 콘텐츠가 저장되었습니다.`, "success");
        } catch (error) {
            console.error("Batch generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Calendar Logic ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear(), month = date.getMonth();
        const days = [];
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        for (let i = firstDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, prevLastDate - i), isCurrentMonth: false });
        for (let i = 1; i <= lastDate; i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        return days;
    };

    const getEventsForDay = (day) => {
        const schedules = scheduledEvents.filter(e => new Date(e.date).toDateString() === day.toDateString());
        const historyEvents = history.filter(item => new Date(item.createdAt || item.date).toDateString() === day.toDateString())
            .map(item => ({ id: item.id, date: item.createdAt, platform: item.platform, type: 'completed', data: item }));
        return [...schedules, ...historyEvents];
    };

    const handleCalendarDrop = (date, eventData) => setScheduledEvents([...scheduledEvents, { ...eventData, date, id: Date.now() }]);
    const handleSaveTemplate = () => setTemplates([...templates, { id: Date.now(), name: `${topic || '새 템플릿'}`, persona: selectedPersona, platforms: 4, usage: 0 }]);
    const handleLoadTemplate = (t) => { setSelectedPersona(t.persona); setSelectedTemplate(t); setShowTemplateModal(false); };

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8">
            <StudioHeader mode={mode} setMode={setMode} />

            <StudioStats platformStats={getPlatformStats()} activeResult={activeResult} />

            <AIBriefingBox user={user} activeResult={activeResult} history={history} />

            <StudioGenerator
                mode={mode} topic={topic} setTopic={setTopic}
                batchTopics={batchTopics} setBatchTopics={setBatchTopics}
                selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona}
                recommendedTags={recommendedTags} handleAddTag={handleAddTag}
                setShowTemplateModal={setShowTemplateModal}
            />

            <div className="relative z-10 mb-12">
                <button
                    onClick={mode === 'single' ? handleGenerateAll : handleBatchGenerate}
                    disabled={isGenerating}
                    className={cn(
                        "w-full py-6 rounded-[24px] font-black text-lg uppercase tracking-tight flex items-center justify-center gap-4 transition-all shadow-2xl disabled:opacity-50",
                        isGenerating ? "bg-gray-800 text-gray-500" : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
                    )}
                >
                    {isGenerating ? <><Loader2 className="animate-spin" /> <span>AI 분석 중...</span></> : <><Zap className="fill-white" /> {mode === 'single' ? '4개 플랫폼 동시 생성' : '보관함 일괄 저장'}</>}
                </button>
            </div>

            <StudioResults
                mode={mode} platformContents={platformContents} batchContents={batchContents}
                platforms={platforms} handleEditContent={(d) => { setPreviewData(d); setShowPreview(true); }}
                handleSchedule={(p, d) => setScheduledEvents([...scheduledEvents, { id: Date.now(), date: new Date(), platform: p, data: d }])}
                scheduledEvents={scheduledEvents}
            />

            <StudioCalendar
                currentDate={currentDate} setCurrentDate={setCurrentDate}
                calendarDays={getDaysInMonth(currentDate)} getEventsForDay={getEventsForDay}
                handleCalendarDrop={handleCalendarDrop} handleEventClick={(e) => { setPreviewData(e.data); setShowPreview(true); }}
                handleSaveTemplate={handleSaveTemplate}
            />

            <TemplateModal
                isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)}
                templates={templates} handleLoadTemplate={handleLoadTemplate}
            />

            <PreviewModal
                isOpen={showPreview} onClose={() => setShowPreview(false)}
                data={previewData} onConfirm={async (data) => {
                    await addToHistory(data);
                    if (data.actionType === 'save') navigate('/history');
                    setShowPreview(false);
                }}
            />
        </div>
    );
};
