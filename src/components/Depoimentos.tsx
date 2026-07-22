import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RewardedUser } from '../types';

interface DepoimentosProps {
  rewardedUsers: RewardedUser[];
  isDarkMode?: boolean;
}

export const Depoimentos: React.FC<DepoimentosProps> = ({
  rewardedUsers,
  isDarkMode = true
}) => {
  const getRelativeTime = (date?: Date) => {
    if (!date) return '';
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'agora';
    if (diff < 60) return `há ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `há ${hours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-2">
      {rewardedUsers.length === 0 ? (
        <div className={`text-center py-16 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
          <p className="text-sm font-medium">Nenhuma recompensa liberada ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {rewardedUsers.map((u) => (
            <div
              key={u.id}
              className={`border rounded-xl p-4 flex flex-col gap-2 ${
                isDarkMode
                  ? 'bg-white/[0.04] border-white/10'
                  : 'bg-black/[0.02] border-black/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
                    <img src={u.photo} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <p className="text-[13px] font-bold text-brand-red">{u.name}</p>
                      <CheckCircle2 className="w-3 h-3 text-brand-red" />
                    </div>
                    <span className={`text-[9px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                      @{u.username}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                      CONTRIBUIU COM {u.contributionAmount} - RECEBEU {u.value}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-tighter ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>
                  {getRelativeTime(u.timestamp)}
                </span>
              </div>
              <p className={`text-[16px] leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {u.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
