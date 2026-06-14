import { useState, useEffect, useRef } from 'react';
import { Headphones, Activity } from 'lucide-react';
import { AudioEngine, type AudioEngineSettings, type SessionPhase } from './utils/audioEngine';
import { SessionSetup } from './components/SessionSetup';
import { ActiveSession } from './components/ActiveSession';
import { EmergencyProtocol } from './components/EmergencyProtocol';
import { SessionHistory } from './components/SessionHistory';

function App() {
  const [view, setView] = useState<'setup' | 'active' | 'sos' | 'history'>('setup');
  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(false);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('opening');
  
  // Settings state
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
  
  const [duration, setDuration] = useState<number>(5); // 5 minutes default
  const [initialSuds, setInitialSuds] = useState<number>(5); // 5 default
  const [audioEngineMsg, setAudioEngineMsg] = useState<string>('');
  
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

    // Load saved preferences if any
    const savedSettings = localStorage.getItem('hearo_user_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure default properties are present
        if (!parsed.voiceoverLanguage) parsed.voiceoverLanguage = 'en';
        if (parsed.spikeCount === undefined) parsed.spikeCount = 4;
        if (parsed.noiseVariantIndex === undefined) parsed.noiseVariantIndex = -1;
        setSettings(parsed);
      } catch (e) {}
    }

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  // Sync state settings to localStorage whenever they change
  const handleSettingsChange = (newSettings: Partial<AudioEngineSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('hearo_user_settings', JSON.stringify(updated));
      
      // Update audio engine on the fly if active
      if (audioEngineRef.current) {
        audioEngineRef.current.updateSettings(updated);
      }
      
      return updated;
    });
  };

  const handleStartSession = async () => {
    if (audioEngineRef.current) {
      setIsLoadingMedia(true);
      // Wait for preload (randomizes background noise, registers triggers, buffers audio files)
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
    setView('setup');
  };

  const handleSaveSession = (finalSuds: number, durationCompleted: number) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }

    // Save to localStorage
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
      duration: durationCompleted,
      initialSuds: initialSuds,
      finalSuds: finalSuds,
    };

    logs.unshift(newLog);
    localStorage.setItem('hearo_session_logs', JSON.stringify(logs));

    setView('history');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('hearo_session_logs');
  };

  return (
    <>
      {/* Floating Decorative Soap Bubbles */}
      <div className="floating-bubbles">
        <div className="floating-bubble" />
        <div className="floating-bubble" />
        <div className="floating-bubble" />
        <div className="floating-bubble" />
        <div className="floating-bubble" />
        <div className="floating-bubble" />
        <div className="floating-bubble" />
      </div>

      {/* App Header (Hidden during active session or SOS to keep screen completely minimal and safe) */}
      {view !== 'active' && view !== 'sos' && !isLoadingMedia && (
        <header className="app-header">
          <div className="app-logo">
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: 'var(--color-primary-soft)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-primary)' 
              }}
            >
              <Headphones size={20} />
            </div>
            <span className="logo-text">HearO</span>
          </div>

          <nav className="nav-tabs">
            <button 
              className={`tab-btn ${view === 'setup' ? 'active' : ''}`}
              onClick={() => setView('setup')}
            >
              Exposure Therapy
            </button>
            <button 
              className={`tab-btn ${view === 'history' ? 'active' : ''}`}
              onClick={() => setView('history')}
            >
              History
            </button>
          </nav>
        </header>
      )}

      {/* Media Loading Overlay */}
      {isLoadingMedia && (
        <div 
          className="view-container"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: 'var(--bg-app)',
            zIndex: 999
          }}
        >
          <div className="glass-panel" style={{ padding: '40px 30px', maxWidth: '340px' }}>
            <div className="pulse-animation" style={{ display: 'inline-flex', marginBottom: '20px', color: 'var(--color-primary)' }}>
              <Headphones size={56} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Preparing therapy space...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Loading and synchronizing high-quality sound files and voice guidance.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fallback Synthesizer Toast indicator */}
      {audioEngineMsg && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 100, 
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--color-primary-soft)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: 'var(--color-primary)',
            boxShadow: 'var(--shadow-md)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'pulse-soft 2s infinite'
          }}
        >
          <Activity size={12} />
          {audioEngineMsg}
        </div>
      )}

      {/* Main View Router */}
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
          onSaveSession={handleSaveSession}
          onCancelSession={handleExitSession}
        />
      )}

      {view === 'sos' && (
        <EmergencyProtocol
          onCloseSOS={handleCloseSOS}
          onExitSession={handleExitSession}
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
