import React from 'react';
import { LayoutDashboard, History, Trophy, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dash' | 'extrato' | 'ranking' | 'depoimentos';
  setActiveTab: (tab: 'dash' | 'extrato' | 'ranking' | 'depoimentos') => void;
  isDarkMode?: boolean;
  unreadDepoimentos?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isDarkMode = true, unreadDepoimentos = 0 }) => {
  return (
    <nav className={`relative z-20 h-16 border-t flex items-center justify-around px-4 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/80 border-black/5'}`}>
      <button 
        onClick={() => setActiveTab('dash')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'dash' ? 'text-brand-red' : (isDarkMode ? 'text-white/40' : 'text-slate-600')}`}
      >
        <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dash' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
      </button>
      <button 
        onClick={() => setActiveTab('extrato')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'extrato' ? 'text-brand-red' : (isDarkMode ? 'text-white/40' : 'text-slate-600')}`}
      >
        <History className={`w-5 h-5 ${activeTab === 'extrato' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Extrato</span>
      </button>
      <button 
        onClick={() => setActiveTab('depoimentos')}
        className={`relative flex flex-col items-center justify-center gap-1 ${activeTab === 'depoimentos' ? 'text-brand-red' : (isDarkMode ? 'text-white/40' : 'text-slate-600')}`}
      >
        <MessageSquare className={`w-5 h-5 ${activeTab === 'depoimentos' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Depoimentos</span>
        {unreadDepoimentos > 0 && (
          <span className="absolute -top-1 -right-3 bg-brand-red text-white text-[8px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 leading-none">
            {unreadDepoimentos > 9 ? '9+' : unreadDepoimentos}
          </span>
        )}
      </button>
      <button 
        onClick={() => setActiveTab('ranking')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'ranking' ? 'text-brand-red' : (isDarkMode ? 'text-white/40' : 'text-slate-600')}`}
      >
        <Trophy className={`w-5 h-5 ${activeTab === 'ranking' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Ranking</span>
      </button>
    </nav>
  );
};