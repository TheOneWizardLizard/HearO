import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { AudioEngine, type AudioEngineSettings, type SessionPhase } from './utils/audioEngine';
import { HomeScreen } from './components/HomeScreen';
import { SettingsSheet } from './components/SettingsSheet';
import { SessionSetup } from './components/SessionSetup';
import { ActiveSession } from './components/ActiveSession';
import { EmergencyProtocol } from './components/EmergencyProtocol';
import { PostSessionFeedback } from './components/PostSessionFeedback';
import { SessionHistory } from './components/SessionHistory';

type ViewState = 'home' | 'setup' | 'active' | 'sos' | 'feedback' | 'history';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(false);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('opening');
  const [showSettings, setShowSettings] = useState(false);
  
  // User profile state
  const [userName, setUserName] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('19:00');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  
  // Audio settings state
  const [settings, setSettings] = useState<AudioEngineSettings>({
    musicVolume: 0.5,
    noiseVolume: 0.2,
    muffleLevel: 0.5,
    spikeFrequency: 0.3,
    spikeCount: 4,
    exposureType: 'cafe',
    voiceoverLanguage: 'en',
    noiseVariantIndex: -1,
  });
  
  const [duration, setDuration] = useState<number>(5);
  const [initialSuds, setInitialSuds] = useState<number>(5);
  const [audioEngineMsg, setAudioEngineMsg] = useState<string>('');
  
  // Session result state (for post-session feedback)
  const [lastSessionFinalSuds, setLastSessionFinalSuds] = useState<number>(5);
  const [lastSessionDuration, setLastSessionDuration] = useState<number>(0);
  
  const audioEngineRef = useRef<AudioEngine | null>(null);

  // Initialize AudioEngine on mount
  useEffect(() => {
    const engine = new AudioEngine((msg) => {
      setAudioEngineMsg(msg);
      setTimeout(() => setAudioEngineMsg(''), 4000);
    });
    
    engine.onPhaseChange = (phase) => {
      setSessionPhase(phase);
    };

    audioEngineRef.current = engine;

    // Load saved preferences
    const savedSettings = localStorage.getItem('hearo_user_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (!parsed.voiceoverLanguage) parsed.voiceoverLanguage = 'en';
        if (parsed.spikeCount === undefined) parsed.spikeCount = 4;
        if (parsed.noiseVariantIndex === undefined) parsed.noiseVariantIndex = -1;
        setSettings(parsed);
      } catch (e) {}
    }

    // Load user profile
    const savedName = localStorage.getItem('hearo_user_name');
    if (savedName) setUserName(savedName);
    
    const savedReminder = localStorage.getItem('hearo_reminder_time');
    if (savedReminder) setReminderTime(savedReminder);
    
    const savedReminderEnabled = localStorage.getItem('hearo_reminder_enabled');
    if (savedReminderEnabled !== null) setReminderEnabled(savedReminderEnabled === 'true');

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  // Get session count from localStorage
  const getSessionCount = (): number => {
    const savedLogs = localStorage.getItem('hearo_session_logs');
    if (savedLogs) {
      try {
        return JSON.parse(savedLogs).length;
      } catch (e) {}
    }
    return 0;
  };

  const handleSettingsChange = (newSettings: Partial<AudioEngineSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('hearo_user_settings', JSON.stringify(updated));
      if (audioEngineRef.current) {
        audioEngineRef.current.updateSettings(updated);
      }
      return updated;
    });
  };

  const handleNameChange = (name: string) => {
    setUserName(name);
    localStorage.setItem('hearo_user_name', name);
  };

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('hearo_reminder_time', time);
  };

  const handleReminderToggle = (enabled: boolean) => {
    setReminderEnabled(enabled);
    localStorage.setItem('hearo_reminder_enabled', String(enabled));
  };

  const handleStartSession = async () => {
    if (audioEngineRef.current) {
      setIsLoadingMedia(true);
      await audioEngineRef.current.preload(settings);
      setIsLoadingMedia(false);
      audioEngineRef.current.start();
      setSessionPhase('opening');
    }
    setView('active');
  };

  const handlePauseToggle = (isPaused: boolean) => {
    if (audioEngineRef.current) {
      if (isPaused) {
        audioEngineRef.current.pause();
      } else {
        audioEngineRef.current.resume();
      }
    }
  };

  const handleSessionTick = (timeLeftSeconds: number) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.tick(timeLeftSeconds);
    }
  };

  const handleTriggerSOS = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.triggerSOS();
    }
    setView('sos');
  };

  const handleCloseSOS = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.clearSOS();
    }
    setView('active');
  };

  const handleExitSession = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    setView('home');
  };

  // When session ends, go to feedback instead of directly saving
  const handleSessionComplete = (finalSuds: number, durationCompleted: number) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    setLastSessionFinalSuds(finalSuds);
    setLastSessionDuration(durationCompleted);
    setView('feedback');
  };

  // Save session log with optional feedback data
  const handleFeedbackComplete = (feedback: { difficulty: number | null; triggerBothered: string | null; notes: string }) => {
    const savedLogs = localStorage.getItem('hearo_session_logs');
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {}
    }

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      environment: settings.exposureType,
      duration: lastSessionDuration,
      initialSuds: initialSuds,
      finalSuds: lastSessionFinalSuds,
      feedback,
    };

    logs.unshift(newLog);
    localStorage.setItem('hearo_session_logs', JSON.stringify(logs));
    setView('home');
  };

  const handleSkipFeedback = () => {
    // Save session without feedback
    const savedLogs = localStorage.getItem('hearo_session_logs');
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {}
    }

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      environment: settings.exposureType,
      duration: lastSessionDuration,
      initialSuds: initialSuds,
      finalSuds: lastSessionFinalSuds,
    };

    logs.unshift(newLog);
    localStorage.setItem('hearo_session_logs', JSON.stringify(logs));
    setView('home');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('hearo_session_logs');
  };

  return (
    <>
      {/* Toast Notification */}
      {audioEngineMsg && (
        <div className="toast">
          <Activity size={12} />
          {audioEngineMsg}
        </div>
      )}

      {/* Media Loading Overlay */}
      {isLoadingMedia && (
        <div className="loading-overlay">
          <div className="spinner" />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '8px' }}>
              Preparing your session...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Loading sound files and voice guidance.
            </p>
          </div>
        </div>
      )}

      {/* Settings Bottom Sheet */}
      <SettingsSheet
        isOpen={showSettings}
        userName={userName}
        reminderTime={reminderTime}
        reminderEnabled={reminderEnabled}
        onClose={() => setShowSettings(false)}
        onNameChange={handleNameChange}
        onReminderTimeChange={handleReminderTimeChange}
        onReminderToggle={handleReminderToggle}
      />

      {/* ===== View Router ===== */}

      {view === 'home' && !isLoadingMedia && (
        <HomeScreen
          userName={userName}
          sessionCount={getSessionCount()}
          onBeginSession={() => setView('setup')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {view === 'setup' && !isLoadingMedia && (
        <SessionSetup
          settings={settings}
          duration={duration}
          initialSuds={initialSuds}
          onSettingsChange={handleSettingsChange}
          onDurationChange={setDuration}
          onInitialSudsChange={setInitialSuds}
          onStartSession={handleStartSession}
          onTriggerSOS={handleTriggerSOS}
          onBack={() => setView('home')}
        />
      )}

      {view === 'active' && (
        <ActiveSession
          settings={settings}
          duration={duration}
          initialSuds={initialSuds}
          sessionPhase={sessionPhase}
          onSettingsChange={handleSettingsChange}
          onPauseToggle={handlePauseToggle}
          onTick={handleSessionTick}
          onTriggerSOS={handleTriggerSOS}
          onSaveSession={handleSessionComplete}
          onCancelSession={handleExitSession}
        />
      )}

      {view === 'sos' && (
        <EmergencyProtocol
          onCloseSOS={handleCloseSOS}
          onExitSession={handleExitSession}
        />
      )}

      {view === 'feedback' && (
        <PostSessionFeedback
          onComplete={handleFeedbackComplete}
          onSkipAll={handleSkipFeedback}
        />
      )}

      {view === 'history' && (
        <SessionHistory
          onClearHistory={handleClearHistory}
        />
      )}
    </>
  );
}

export default App;
