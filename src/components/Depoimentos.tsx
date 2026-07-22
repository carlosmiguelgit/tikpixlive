import React, { useEffect, useRef } from 'react';
import { MessageSquare, User, CheckCircle2, Circle } from 'lucide-react';
import { Testimonial, RewardedUser } from '../types';

interface DepoimentosProps {
  dynamicTestimonials: Testimonial[];
  rewardedUsers: RewardedUser[];
  onUserClick: (user: RewardedUser) => void;
  highlightName?: string | null;
  isDarkMode?: boolean;
}

export const Depoimentos: React.FC<DepoimentosProps> = ({
  dynamicTestimonials,
  rewardedUsers,
  onUserClick,
  highlightName,
  isDarkMode = true
}) => {
  const allTestimonials = dynamicTestimonials;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightName) {
      const element = document.getElementById(`testimonial-${highlightName}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightName]);

  const getRelativeTime = (date?: Date) => {
    if (!date) return 'agora';
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'agora';
    if (diff < 60) return `há ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `há ${hours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-2" ref={containerRef}>
      {rewardedUsers.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`}>RECOMPENSAS ({rewardedUsers.length})</h4>
          </div>
          <div className="space-y-2 mb-6">
            {rewardedUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onUserClick(u)}
                className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all ${
                  isDarkMode
                    ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    : 'bg-black/[0.02] border-black/5 hover:bg-black/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
                  <img src={u.photo} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{u.name}</p>
                  <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>@{u.username}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>
                    {u.months}
                  </span>
                  {u.read ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-red-500 fill-red-500/30 shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`}>Depoimentos ({allTestimonials.length})</h4>
        <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-slate-300'}`} />
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {allTestimonials.map((t, idx) => (
          <div
            key={`${t.id}-${idx}`}
            id={`testimonial-${t.name}`}
            className={`border rounded-xl p-4 flex flex-col gap-2 transition-all duration-500 ${
              isDarkMode
                ? 'bg-white/[0.04] border-white/10'
                : 'bg-black/[0.02] border-black/5'
            } ${highlightName === t.name ? 'border-brand-red bg-brand-red/10 scale-[1.02]' : 'hover:border-brand-red/30'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className={`w-4 h-4 ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`} />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-[13px] font-bold text-brand-red">{t.name}</p>
                    <CheckCircle2 className="w-3 h-3 text-brand-red" />
                  </div>
                  {t.username && (
                    <span className={`text-[9px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                      @{t.username}
                    </span>
                  )}
                  {t.months && (
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                      {t.months} {t.months === 1 ? 'MÊS' : 'MESES'} • SUPER-FÃ
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-tighter ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>
                {getRelativeTime(t.timestamp)}
              </span>
            </div>
            <p className={`text-[16px] leading-tight font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              "{t.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};