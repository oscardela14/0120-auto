import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ResultView = ({ data, onBack }) => {
    const navigate = useNavigate();
    
    React.useEffect(() => {
        if (onBack) {
            onBack();
        } else {
            navigate('/topics');
        }
    }, [onBack, navigate]);
    
    return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center">
            <div className="text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Redirecting...</h2>
                <p className="text-gray-400">Content is now displayed in TopicPage</p>
            </div>
        </div>
    );
};

export default ResultView;
