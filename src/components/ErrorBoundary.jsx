import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-red-500/20 rounded-3xl backdrop-blur-xl h-full min-h-[200px] text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-white font-black mb-2 uppercase tracking-tighter">Widget Error</h3>
                    <p className="text-gray-500 text-xs font-medium mb-6 leading-relaxed">
                        컴포넌트를 로드하는 중 예상치 못한 오류가 발생했습니다.<br />시스템 정합성을 유지하기 위해 로딩이 중단되었습니다.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-gray-400 hover:text-white transition-all flex items-center gap-2 mx-auto"
                    >
                        <RefreshCcw size={14} />
                        Retry Component
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
