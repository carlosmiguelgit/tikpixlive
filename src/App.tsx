import { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Extrato } from './components/Extrato';
import { Ranking } from './components/Ranking';
import { Depoimentos } from './components/Depoimentos';
import { BottomNav } from './components/BottomNav';
import { PasswordLock } from './components/PasswordLock';
import { Notification, RewardedUser } from './types';
import { useNotificationSystem } from './hooks/useNotificationSystem';
import { getThankYouMessage } from './constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dash' | 'extrato' | 'ranking' | 'depoimentos'>('dash');
  const [confirmedNotifications, setConfirmedNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [batteryClickCount, setBatteryClickCount] = useState(0);
  const [rewardedUsers, setRewardedUsers] = useState<RewardedUser[]>([]);
  const agradecimentoIndexRef = useRef(0);

  const {
    notifications,
    setNotifications,
    dynamicTestimonials,
    unreadDepoimentos,
    setUnreadDepoimentos,
    setPendingTestimonials,
    addToBlacklist,
    generateNotification
  } = useNotificationSystem();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
      root.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      root.style.backgroundColor = '#FDFCF7';
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (activeTab === 'depoimentos') {
      setUnreadDepoimentos(0);
    }
  }, [activeTab, setUnreadDepoimentos]);

  useEffect(() => {
    const delay = Math.floor(Math.random() * 15000) + 30000;
    const timer = setTimeout(() => {
      generateNotification();
    }, delay);
    return () => clearTimeout(timer);
  }, [notifications.length, generateNotification]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleBatteryClick = () => {
    setBatteryClickCount(prev => {
      const next = prev + 1;
      if (next === 3) {
        setIsAnonymousMode(!isAnonymousMode);
        return 0;
      }
      return next;
    });
    setTimeout(() => setBatteryClickCount(0), 3000);
  };

  const handleLiberarRecompensa = (notif: Notification) => {
    setConfirmedNotifications(prev => [notif, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setActiveNotification(null);
    addToBlacklist(notif.name);

    const mensagem = getThankYouMessage(notif.value, agradecimentoIndexRef);

    setTimeout(() => {
      const rewardedUser: RewardedUser = {
        id: notif.id,
        name: notif.name,
        username: notif.username,
        photo: notif.photo,
        gender: notif.gender,
        months: notif.months,
        value: notif.value,
        followingCount: notif.followingCount,
        followerCount: notif.followerCount,
        fullName: notif.fullName,
        message: mensagem,
        timestamp: new Date(),
      };
      setRewardedUsers(prev => [rewardedUser, ...prev]);
    }, 30000);
  };

  const handleRessarcir = (notif: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setActiveNotification(null);
  };

  return (
    <div className={`flex justify-center items-center h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-black' : 'bg-[#e5e7eb]'}`}>
      <div className={`relative w-full max-w-3xl h-full overflow-hidden shadow-2xl border-x transition-colors duration-500 flex flex-col ${isDarkMode ? 'bg-brand-dark border-white/5 text-white' : 'bg-[#FDFCF7] border-black/5 text-slate-900'}`}>
        {!isAuthenticated ? (
          <PasswordLock onSuccess={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} />
        ) : (
          <>
        <StatusBar 
          onBatteryClick={handleBatteryClick} 
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
        
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] blur-[120px] rounded-full transition-opacity duration-700 ${isDarkMode ? 'bg-brand-red/10 opacity-100' : 'bg-brand-red/5 opacity-50'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] blur-[120px] rounded-full transition-opacity duration-700 ${isDarkMode ? 'bg-blue-500/10 opacity-100' : 'bg-blue-500/5 opacity-30'}`} />
        
        <Header 
          isDarkMode={isDarkMode}
        />
        
        <main className="relative z-10 flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-4 pt-2">
          {activeTab === 'dash' && (
            <Dashboard
              notifications={notifications}
              activeNotification={activeNotification}
              setActiveNotification={setActiveNotification}
              isAnonymousMode={isAnonymousMode}
              isDarkMode={isDarkMode}
              onLiberarRecompensa={handleLiberarRecompensa}
              onRessarcir={handleRessarcir}
            />
          )}
          {activeTab === 'extrato' && (
            <Extrato 
              confirmedNotifications={confirmedNotifications} 
              dynamicTestimonials={dynamicTestimonials}
              isAnonymousMode={isAnonymousMode} 
              isDarkMode={isDarkMode}
            />
          )}
          {activeTab === 'ranking' && (
            <Ranking 
              confirmedNotifications={confirmedNotifications}
              isAnonymousMode={isAnonymousMode}
              isDarkMode={isDarkMode}
            />
          )}
          {activeTab === 'depoimentos' && (
            <Depoimentos
              rewardedUsers={rewardedUsers}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
        
        <div className="shrink-0">
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isDarkMode={isDarkMode}
            unreadDepoimentos={unreadDepoimentos}
          />
        </div>
        
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full z-20 transition-colors duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
          </>
        )}
      </div>
    </div>
  );
}