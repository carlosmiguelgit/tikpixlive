import { useState, useEffect, useRef } from 'react';
import { RewardedUser } from '../types';
import { getThankYouMessage } from '../constants';

interface PrivateChatProps {
  user: RewardedUser;
  onBack: () => void;
}

export default function PrivateChat({ user, onBack }: PrivateChatProps) {
  const [messages, setMessages] = useState<{ text: string; sender: 'me' | 'them' }[]>([]);
  const [showVisto, setShowVisto] = useState(false);
  const fraseIndexRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([{ text: 'recebeu aí?', sender: 'me' }]);
      setShowVisto(true);

      const t2 = setTimeout(() => {
        setShowVisto(false);
        const frase = getThankYouMessage(user.value, fraseIndexRef);
        setMessages(prev => [...prev, { text: frase, sender: 'them' }]);
      }, 4000 + Math.random() * 2000);

      return () => clearTimeout(t2);
    }, 1000);

    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-white text-black overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 h-[54px] pt-2.5 bg-white shrink-0 min-h-[54px]">
        <button onClick={onBack} className="p-1 -ml-1 text-zinc-800 shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-zinc-800">
            <path d="M14 5L9 11L14 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="w-[30px] h-[30px] rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-zinc-300">
          <img src={user.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <span className="text-[18px] font-semibold text-black truncate leading-tight">{user.name}</span>
        <div className="flex-1" />
        <button className="flex items-center gap-[3px] shrink-0 pr-1">
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
          <span className="w-[4px] h-[4px] rounded-full bg-zinc-700" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-[52px] pb-6 shrink-0 bg-white">
        <div className="w-[76px] h-[76px] rounded-full bg-zinc-200 overflow-hidden border-2 border-white mb-3 shrink-0">
          <img src={user.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <span className="text-[24px] font-bold text-black mb-1">{user.name}</span>
        <span className="text-[14px] text-[#555] mb-0.5">@{user.username}</span>
        {user.followingCount !== undefined && user.followerCount !== undefined && (
          <span className="text-[14px] text-zinc-500 mb-2">{user.followingCount.toLocaleString('pt-BR')} seguindo · {user.followerCount.toLocaleString('pt-BR')} seguidores</span>
        )}
        <button className="bg-[#ed4956] text-white text-[18px] font-bold px-12 py-[0.35rem] rounded-full">Seguir</button>
      </div>

      <div className="flex-1 bg-white overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {messages.map((msg, i) => (
          msg.sender === 'me' ? (
            <div key={i} className="flex flex-col items-end gap-1">
              <div className="bg-[#4f6ef7] text-white text-[14px] px-3 py-2 rounded-[18px] max-w-[280px] leading-snug break-words">{msg.text}</div>
              {showVisto && <span className="text-[10px] text-zinc-400 leading-none pr-1">Visto</span>}
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              <div className="w-[28px] h-[28px] rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-zinc-300">
                <img src={user.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-[#D4D4D4] text-black text-[14px] px-3 py-2 rounded-[18px] max-w-[280px] leading-snug break-words">
                {msg.text}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}