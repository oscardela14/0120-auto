import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, Users, Activity, Lock, Unlock,
    Trash2, Search, Database, Server, Cpu,
    AlertTriangle, Terminal, Eye, EyeOff, Crown
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const { user, addNotification, history, usage } = useUser();
    const navigate = useNavigate();
    const [systemHealth, setSystemHealth] = useState(98.4);
    const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 50) + 120);
    const [logs, setLogs] = useState([]);
    const [isGodMode, setIsGodMode] = useState(true);

    // Derived Realistic Stats
    const totalGenerated = history.length;
    const totalCreditsUsed = usage.total;

    // Enhanced User List Simulation
    const [mockUsers, setMockUsers] = useState([
        { id: 'admin-master', name: user?.name || 'Admin', email: user?.email || 'admin@master.com', plan: 'business', status: 'active', lastLogin: 'Just now', ip: '127.0.0.1 (YOU)', usage: usage.total },
        { id: 1, name: 'Kim Viral', email: 'viral_king@naver.com', plan: 'pro', status: 'active', lastLogin: '2 mins ago', ip: '192.168.0.1', usage: 452 },
        { id: 2, name: 'Content Master', email: 'cm_studio@gmail.com', plan: 'business', status: 'active', lastLogin: '1 hour ago', ip: '210.45.2.11', usage: 1205 },
        { id: 3, name: 'Spam Bot 3000', email: 'bot_attack@hack.net', plan: 'free', status: 'banned', lastLogin: '3 days ago', ip: 'Unknown', usage: 0 },
        { id: 4, name: 'Lee Marketing', email: 'lee_mkt@kakao.com', plan: 'starter', status: 'active', lastLogin: '5 mins ago', ip: '58.23.11.4', usage: 184 },
        { id: 5, name: 'Newbie Creates', email: 'newbie01@gmail.com', plan: 'free', status: 'warning', lastLogin: '15 mins ago', ip: '112.44.22.9', usage: 12 },
    ]);

    // Security check
    useEffect(() => {
        if (user && user.role !== 'admin') {
            addNotification("접근 권한이 없습니다. (Access Denied)", "error");
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Simulated Log Stream
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                `[AUTH] User login successful (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1)`,
                `[API] Cerebras Inference request (Tokens: ${Math.floor(Math.random() * 800) + 200})`,
                `[SYSTEM] Real-time SEO cache synchronized`,
                `[WARN] Surge in '설날' keyword traffic detected`,
                `[SECURITY] Blocked suspicious crawler from 45.2.1.8`,
                `[PAYMENT] Subscription renewed: ₩99,000 (User: ${mockUsers[Math.floor(Math.random() * mockUsers.length)].name})`,
                `[CONTENT] New master blueprint generated for topic: ${history[0]?.topic || 'Social Trends'}`
            ];
            const randomLog = actions[Math.floor(Math.random() * actions.length)];
            setLogs(prev => [
                { time: new Date().toLocaleTimeString(), text: randomLog, id: Date.now() },
                ...prev.slice(0, 19)
            ]);

            // Realistic fluctuations
            setActiveUsers(prev => Math.max(100, prev + (Math.random() > 0.5 ? 2 : -2)));
            setSystemHealth(prev => {
                const noise = (Math.random() - 0.5) * 0.1;
                return Math.min(100, Math.max(95, prev + noise));
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleBanUser = (userId) => {
        setMockUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
        ));
        const target = mockUsers.find(u => u.id === userId);
        addNotification(`${target.name} 사용자의 상태를 ${target.status === 'banned' ? '정상(Active)' : '차단(Banned)'}으로 변경했습니다.`, target.status === 'banned' ? "success" : "warning");
    };

    const handleForceUpgrade = (userId) => {
        setMockUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, plan: 'business' } : u
        ));
        addNotification("해당 사용자를 Business 플랜으로 강제 승격시켰습니다.", "success");
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen p-6 max-w-[1600px] mx-auto pb-32 font-mono text-sm text-gray-400">
            {/* Header: System Status */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 border-b border-red-900/30 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-red-500 mb-2 flex items-center gap-3">
                        <ShieldAlert size={32} />
                        GOD MODE DASHBOARD
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        SYSTEM ONLINE | ACCESS LEVEL: ROOT DIRECTOR
                    </p>
                </div>
                <div className="flex gap-4 items-stretch">
                    {/* Emergency Control (Moved to Header) */}
                    <div className="bg-[#1f1212] border border-red-900/30 rounded-xl p-3 flex flex-col justify-center min-w-[280px]">
                        <h3 className="text-red-500 font-black mb-2 flex items-center gap-2 text-xs">
                            <AlertTriangle size={14} /> EMERGENCY CONTROL
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 text-center">
                                FLUSH ALL DNS
                            </button>
                            <button className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 text-center">
                                LOCKDOWN MODE
                            </button>
                            <button className="col-span-2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2"
                                onClick={() => addNotification("전체 서버 재부팅 명령이 예약되었습니다. (Estimated: 03:00 AM)", "info")}
                            >
                                <Server size={12} /> REBOOT SERVERS (MAINTENANCE)
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-red-900/20 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                        <div className="p-3 bg-red-900/20 rounded-lg text-red-500"><Terminal size={20} /></div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-red-500/50">Total Generated</div>
                            <div className="text-2xl font-black text-white">{totalGenerated}</div>
                        </div>
                    </div>
                    <div className="bg-black/40 border border-red-900/20 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                        <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-500"><Cpu size={20} /></div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-emerald-500/50">System Health</div>
                            <div className="text-2xl font-black text-white">{systemHealth.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[70vh]">
                {/* Left: User Management */}
                <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                            <Database size={18} className="text-indigo-500" />
                            USER DATABASE
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search email or UID..."
                                className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-red-500 outline-none w-64"
                            />
                            <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/[0.02] sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400">User Info</th>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Plan</th>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Total Usage</th>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Status</th>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Last Active</th>
                                    <th className="p-4 text-xs font-bold uppercase text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mockUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-sm text-white mb-0.5">{u.name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{u.email}</div>
                                            <div className="text-[10px] text-gray-600 mt-1">IP: {u.ip}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[9px] uppercase font-black border",
                                                u.plan === 'business' ? "bg-purple-900/20 text-purple-400 border-purple-500/20" :
                                                    u.plan === 'pro' ? "bg-indigo-900/20 text-indigo-400 border-indigo-500/20" :
                                                        "bg-gray-800 text-gray-400 border-gray-700"
                                            )}>{u.plan}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs font-mono text-gray-300">{u.usage}</div>
                                                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (u.usage / 1500) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "flex items-center gap-2 text-base font-bold",
                                                u.status === 'active' ? "text-emerald-500" :
                                                    u.status === 'banned' ? "text-red-500" : "text-amber-500"
                                            )}>
                                                <span className={cn("w-2.5 h-2.5 rounded-full",
                                                    u.status === 'active' ? "bg-emerald-500" :
                                                        u.status === 'banned' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                                                )}></span>
                                                {u.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-base text-gray-400">
                                            {u.lastLogin}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleForceUpgrade(u.id)}
                                                    className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/20 transition-colors" title="Force Upgrade Plan">
                                                    <Lock size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleBanUser(u.id)}
                                                    className={cn("p-2 rounded-lg border transition-colors",
                                                        u.status === 'banned'
                                                            ? "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20"
                                                            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                                                    )} title="Ban/Unban User">
                                                    {u.status === 'banned' ? <Unlock size={14} /> : <Trash2 size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Security Logs & Control */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    {/* Console Log */}
                    <div className="flex-1 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col font-mono text-xs">
                        <div className="p-3 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-green-500 font-bold"><Terminal size={14} /> SYSTEM_TERMINAL</span>
                            <span className="text-[10px] text-gray-600">v4.2.0-stable</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-gray-400 custom-scrollbar">
                            {logs.map((log) => (
                                <div key={log.id} className="break-all hover:text-white transition-colors">
                                    <span className="text-gray-600 mr-2">[{log.time}]</span>
                                    {log.text.includes("[WARN]") || log.text.includes("[SECURITY]") ? (
                                        <span className="text-red-400 font-bold">{log.text}</span>
                                    ) : log.text.includes("[PAYMENT]") ? (
                                        <span className="text-green-400 font-bold">{log.text}</span>
                                    ) : (
                                        <span>{log.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-2 bg-[#1a1a1a] border-t border-white/10">
                            <span className="text-green-500 animate-pulse">_</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
