import { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Extrato } from './components/Extrato';
import { Ranking } from './components/Ranking';
import { Depoimentos } from './components/Depoimentos';
import { BottomNav } from './components/BottomNav';
import { PasswordLock } from './components/PasswordLock';
import NubankPage from './pages/NubankPage';
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
  const pendingNotifIdRef = useRef<string | null>(null);
  const processedIdsRef = useRef<Set<string>>(new Set());

  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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

  const [externalProcessedId, setExternalProcessedId] = useState<string | null>(null);

  const agradecimentoIndexRef = useRef(0);

  useEffect(() => {
    generateNotification();
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    if (processedIdsRef.current.has(latest.id)) return;
    pendingNotifIdRef.current = latest.id;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (!data.pending && pendingNotifIdRef.current && !processedIdsRef.current.has(pendingNotifIdRef.current)) {
          const notifId = pendingNotifIdRef.current;
          processedIdsRef.current.add(notifId);
          const found = notifications.find(n => n.id === notifId);
          if (found) {
            if (found.alerta) {
              handleRessarcir(found);
            } else {
              handleLiberarRecompensa(found);
              setExternalProcessedId(notifId);
            }
          }
          clearInterval(interval);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [notifications]);

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
    setExternalProcessedId(null);
    setConfirmedNotifications(prev => [notif, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setActiveNotification(null);
    addToBlacklist(notif.name);

    const nextDelay = Math.floor(Math.random() * 5000) + 10000;
    setTimeout(() => generateNotification(), nextDelay);

    fetch(`/api/process-by-id/${notif.id}`, { method: 'POST' }).catch(() => {});

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
        contributionAmount: notif.contributionAmount,
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

  if (hash.startsWith('#/nubank')) {
    return <NubankPage />;
  }

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
              externalProcessedId={externalProcessedId}
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
