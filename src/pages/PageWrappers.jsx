import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { StudioView } from '../components/StudioView';
import { HistoryView } from '../components/HistoryView';
import { PricingView } from '../components/PricingView';
import { GuideView } from '../components/GuideView';
import { SettingsView } from '../components/SettingsView';
import { AnalyzerView } from '../components/AnalyzerView';
import { ProductionLabView } from '../components/ProductionLabView';
import { GrowthStrategyView } from '../components/GrowthStrategyView';
import { TwinView } from '../components/TwinView';

// New Features
import ReputationGuardView from '../components/ReputationGuardView';
import CompetitorReconView from '../components/CompetitorReconView';
import FanCareView from '../components/FanCareView';

export const StudioPage = () => {
    const { history, isAuthenticated } = useUser();
    const context = useOutletContext();
    const onRequireAuth = context?.onRequireAuth || (() => { });

    return <StudioView history={history} isAuthenticated={isAuthenticated} onRequireAuth={onRequireAuth} />;
};

export const AnalyzerPage = () => <AnalyzerView />;
export const ProductionLabPage = () => <ProductionLabView />;
export const GrowthPage = () => <GrowthStrategyView />;
export const TwinPage = () => <TwinView />;

// New Features Wrappers
export const ReputationPage = () => <ReputationGuardView />;
export const ReconPage = () => <CompetitorReconView />;
export const FanCarePage = () => <FanCareView />;

export const HistoryPage = () => {
    const { history, deleteHistory } = useUser();
    return <HistoryView history={history} onDelete={deleteHistory} />;
};

export const PricingPage = () => {
    const context = useOutletContext();
    const onOpenLegal = context?.onOpenLegal || (() => { });
    return <PricingView onOpenLegal={onOpenLegal} />;
};

export const GuidePage = () => {
    return <GuideView />;
};

export const SettingsPage = () => {
    const navigate = useNavigate();
    const handleNavigate = (tab) => {
        const map = {
            'dashboard': '/dashboard',
            'topics': '/topics',
            'studio': '/studio',
            'history': '/history',
            'pricing': '/pricing',
            'guide': '/guide',
            'settings': '/settings'
        };
        navigate(map[tab] || '/dashboard');
    };
    return <SettingsView onNavigate={handleNavigate} />;
};
