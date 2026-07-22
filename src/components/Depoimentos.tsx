import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { RewardedUser } from '../types';

interface DepoimentosProps {
  rewardedUsers: RewardedUser[];
  onUserClick: (user: RewardedUser) => void;
  isDarkMode?: boolean;
}

export const Depoimentos: React.FC<DepoimentosProps> = ({
  rewardedUsers,
  onUserClick,
  isDarkMode = true
}) => {
  return (
    <div className="mt-2">
      {rewardedUsers.length === 0 ? (
        <div className={`text-center py-16 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
          <p className="text-sm font-medium">Nenhuma recompensa liberada ainda</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`}>RECOMPENSAS ({rewardedUsers.length})</h4>
          </div>
          <div className="space-y-2">
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
    </div>
  );
};