import { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Extrato } from './components/Extrato';
import { Ranking } from './components/Ranking';
import { Depoimentos } from './components/Depoimentos';
import { BottomNav } from './components/BottomNav';
import { NubankSheet } from './components/NubankSheet';
import { PasswordLock } from './components/PasswordLock';
import PrivateChat from './components/PrivateChat';
import { Notification } from './types';
import { useNotificationSystem } from './hooks/useNotificationSystem';
import { CONFIRMACOES, RESPOSTAS_30, RESPOSTAS_80, RESPOSTAS_150 } from './constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dash' | 'extrato' | 'ranking' | 'depoimentos'>('dash');
  const [confirmedNotifications, setConfirmedNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(84600.00);
  const [nubankBalance, setNubankBalance] = useState(348742.18);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isNubankSheetOpen, setIsNubankSheetOpen] = useState(false);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [chatNotification, setChatNotification] = useState<Notification | null>(null);
  const [chatSendNonce, setChatSendNonce] = useState(0);
  const [isChatPayment, setIsChatPayment] = useState(false);
  const [chatPaymentValue, setChatPaymentValue] = useState(500);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [batteryClickCount, setBatteryClickCount] = useState(0);
  const [fraseConfirmacao, setFraseConfirmacao] = useState('');
  const [fraseAgradecimento, setFraseAgradecimento] = useState('');

  const confirmacaoIndexRef = useRef(0);
  const agradecimento30IndexRef = useRef(0);
  const agradecimento80IndexRef = useRef(0);
  const agradecimento150IndexRef = useRef(0);
  const agradecimentoTextRef = useRef('');

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

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleStartPayment = (notif: Notification) => {
    setActiveNotification(notif);
    setIsNubankSheetOpen(true);
  };

  const processPayment = (method: 'conta' | 'credito', editedValue?: number, notifToProcess?: Notification) => {
    const targetNotif = notifToProcess || activeNotification;
    if (!targetNotif) return;

    const finalValue = editedValue ?? targetNotif.value;
    
    setConfirmedNotifications(prev => [{ ...targetNotif, value: finalValue }, ...prev]);
    setNubankBalance(prev => prev - finalValue);
    setBalance(prev => prev - finalValue);
    setNotifications(prev => prev.filter(n => n.id !== targetNotif.id));
    addToBlacklist(targetNotif.name);

    if (Math.random() < 0.85) {
      const delaySeconds = Math.floor(Math.random() * 180) + 300;
      const visibleAt = Date.now() + (delaySeconds * 1000);
      setPendingTestimonials(prev => [...prev, {
        id: `dyn-${targetNotif.id}`,
        name: targetNotif.name,
        text: agradecimentoTextRef.current || "só gratidão guilherme, de verdade",
        rating: 5,
        gender: targetNotif.gender,
        photo: "", 
        months: targetNotif.months,
        timestamp: new Date(Date.now() - 3600000),
        visibleAt
      }]);
    }
  };

  const handleChatNubankOpen = (pixName?: string) => {
    if (pixName && chatNotification) {
      setActiveNotification({ ...chatNotification, name: pixName });
    } else {
      setActiveNotification(chatNotification);
    }
    setIsChatPayment(true);
    setIsNubankSheetOpen(true);
  };

  const handleConfirmNubank = (method: 'conta' | 'credito', editedValue: number) => {
    if (isChatPayment) {
      processPayment(method, editedValue, chatNotification || undefined);
      setChatPaymentValue(editedValue);
      setChatSendNonce(prev => prev + 1);
      setIsChatPayment(false);
    } else {
      processPayment(method, editedValue);
    }
    setActiveNotification(null);
  };

  const handleCloseNubank = () => {
    setIsNubankSheetOpen(false);
    setActiveNotification(null);
    setIsChatPayment(false);
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

  const handleStartChat = (notif: Notification) => {
    setChatNotification(notif);

    const idxConf = confirmacaoIndexRef.current;
    confirmacaoIndexRef.current = (idxConf + 1) % CONFIRMACOES.length;
    setFraseConfirmacao(CONFIRMACOES[idxConf]);

    const pool = notif.value >= 150 ? RESPOSTAS_150 : notif.value >= 80 ? RESPOSTAS_80 : RESPOSTAS_30;
    const idxRef = notif.value >= 150 ? agradecimento150IndexRef : notif.value >= 80 ? agradecimento80IndexRef : agradecimento30IndexRef;
    const idxAgr = idxRef.current;
    idxRef.current = (idxAgr + 1) % pool.length;
    const frase = pool[idxAgr];
    setFraseAgradecimento(frase);
    agradecimentoTextRef.current = frase;
  };

  const handleRessarcir = (notif: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setActiveNotification(null);
  };

  const handleChatComplete = (name: string, pixKey: string) => {
    if (!chatNotification) return;
    const notif = { ...chatNotification, name, pixKey };
    setConfirmedNotifications(prev => [notif, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== chatNotification.id));
    addToBlacklist(chatNotification.name);
    if (Math.random() < 0.85) {
      const delaySeconds = Math.floor(Math.random() * 180) + 300;
      const visibleAt = Date.now() + (delaySeconds * 1000);
      setPendingTestimonials(prev => [...prev, {
        id: `dyn-${chatNotification.id}`,
        name: chatNotification.name,
        text: "só gratidão guilherme, de verdade",
        rating: 5,
        gender: chatNotification.gender,
        photo: "",
        months: chatNotification.months,
        timestamp: new Date(Date.now() - 3600000),
        visibleAt
      }]);
    }
    setChatNotification(null);
  };

  const handleChatBack = () => {
    setChatNotification(null);
  };

  const avatarTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleAvatarClick = () => {
    if (avatarTimer.current) clearTimeout(avatarTimer.current);
    const delay = Math.floor(Math.random() * 3000) + 5000;
    avatarTimer.current = setTimeout(() => {
      generateNotification();
    }, delay);
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
          onAvatarClick={handleAvatarClick}
        />
        
        <main className="relative z-10 flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-4 pt-2">
          {activeTab === 'dash' && (
            <Dashboard
              notifications={notifications}
              activeNotification={activeNotification}
              setActiveNotification={setActiveNotification}
              isAnonymousMode={isAnonymousMode}
              isDarkMode={isDarkMode}
              onStartChat={handleStartChat}
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
              dynamicTestimonials={dynamicTestimonials}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
        
        <NubankSheet 
          isOpen={isNubankSheetOpen}
          onClose={handleCloseNubank}
          notification={activeNotification}
          nubankBalance={nubankBalance}
          onConfirm={handleConfirmNubank}
          isAnonymousMode={isAnonymousMode}
          isDarkMode={isDarkMode}
        />

        {!isNubankSheetOpen && (
          <div className="shrink-0">
            <BottomNav 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isDarkMode={isDarkMode}
              unreadDepoimentos={unreadDepoimentos}
            />
          </div>
        )}
        
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full z-20 transition-colors duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />

        {chatNotification && (
          <PrivateChat
            username={chatNotification.username}
            nickname={chatNotification.name}
            fullName={chatNotification.fullName}
            avatar={chatNotification.photo}
            followingCount={chatNotification.followingCount}
            followerCount={chatNotification.followerCount}
            onComplete={handleChatComplete}
            onBack={handleChatBack}
            onNubankOpen={handleChatNubankOpen}
            chatSendNonce={chatSendNonce}
            paymentValue={chatPaymentValue}
            fraseConfirmacao={fraseConfirmacao}
            fraseAgradecimento={fraseAgradecimento}
          />
        )}
          </>
        )}
      </div>
    </div>
  );
}