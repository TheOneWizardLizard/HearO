import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Play, Pause, Square, CheckCircle, Volume2 } from 'lucide-react';
import type { AudioEngineSettings, ExposureType, SessionPhase } from '../utils/audioEngine';

interface ActiveSessionProps {
  settings: AudioEngineSettings;
  duration: number; // in minutes
  initialSuds: number;
  sessionPhase: SessionPhase;
  onSettingsChange: (newSettings: Partial<AudioEngineSettings>) => void;
  onPauseToggle: (isPaused: boolean) => void;
  onTick: (timeLeftSeconds: number) => void;
  onTriggerSOS: () => void;
  onSaveSession: (finalSuds: number, durationCompleted: number) => void;
  onCancelSession: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  settings,
  duration,
  initialSuds,
  sessionPhase,
  onSettingsChange,
  onPauseToggle,
  onTick,
  onTriggerSOS,
  onSaveSession,
  onCancelSession,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [breathState, setBreathState] = useState<'in' | 'out'>('in');
  const [breathCounter, setBreathCounter] = useState(4); // 4 seconds cycle
  const [isFinishing, setIsFinishing] = useState(false);
  const [finalSuds, setFinalSuds] = useState(initialSuds);
  
  const timerRef = useRef<number | null>(null);
  
  const onTickRef = useRef(onTick);
  const onPauseToggleRef = useRef(onPauseToggle);

  useEffect(() => {
    onTickRef.current = onTick;
    onPauseToggleRef.current = onPauseToggle;
  }, [onTick, onPauseToggle]);

  // Total duration completed tracker (for history log)
  const durationCompleted = Math.round(((duration * 60) - timeLeft) / 60 * 10) / 10;

  // Main timer effect: manages both session countdown and breathing guide on a single interval
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        // 1. Session countdown
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionFinished();
            return 0;
          }
          const next = prev - 1;
          onTickRef.current(next);
          return next;
        });

        // 2. Breathing guide
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathState((state) => (state === 'in' ? 'out' : 'in'));
            return 4; // Reset to 4s
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleToggleActive = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    onPauseToggleRef.current(!nextActive); // passed paused = !active
  };

  const handleSessionFinished = () => {
    setIsActive(false);
    onPauseToggleRef.current(true); // Pause engine when finishing
    setIsFinishing(true);
  };

  const handleSave = () => {
    onSaveSession(finalSuds, durationCompleted || 0.1);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEnvName = (type: ExposureType) => {
    switch (type) {
      case 'cafe': return 'Cafe';
      case 'street': return 'Busy Street';
      case 'beach': return 'Sea Beach';
      case 'forest': return 'Quiet Forest';
    }
  };

  const getEnvImage = (type: ExposureType) => {
    switch (type) {
      case 'cafe': return '/media/תמונות/Coffee Shop.png';
      case 'street': return '/media/תמונות/Calm Street.jpg';
      case 'beach': return '/media/תמונות/Beach.png';
      case 'forest': return '/media/תמונות/Forest.png';
      default: return '/media/תמונות/Gemini_Generated_Image_.png';
    }
  };

  const getSudsDescription = (val: number): string => {
    if (val <= 2) return 'Calm and relaxed';
    if (val <= 4) return 'Mild tension or slight discomfort';
    if (val <= 6) return 'Moderate tension, noticeable but controlled';
    if (val <= 8) return 'High tension, strong urge to avoid';
    return 'Extreme tension, difficulty concentrating / panic';
  };

  // Breathing circle style
  const breathingCircleStyle = {
    transform: breathState === 'in' 
      ? `scale(${1 + (4 - breathCounter) * 0.12})` // Grows from 1.0 to ~1.48
      : `scale(${1.48 - (4 - breathCounter) * 0.12})`, // Shrinks back
    backgroundColor: breathState === 'in' 
      ? `rgba(65, 101, 98, ${0.08 + (4 - breathCounter) * 0.04})` 
      : `rgba(114, 90, 65, ${0.2 - (4 - breathCounter) * 0.04})`,
    boxShadow: breathState === 'in'
      ? `0 0 ${20 + (4 - breathCounter) * 10}px rgba(65, 101, 98, 0.2)`
      : `0 0 ${60 - (4 - breathCounter) * 10}px rgba(114, 90, 65, 0.2)`,
    transition: 'transform 1s linear, background-color 1s ease, box-shadow 1s ease',
  };

  const phasesList: { id: SessionPhase; num: number; label: string }[] = [
    { id: 'opening', num: 1, label: 'Preparation' },
    { id: 'briefing', num: 2, label: 'Guidance' },
    { id: 'exposure', num: 3, label: 'Exposure' },
    { id: 'closing', num: 4, label: 'Summary' },
  ];

  if (isFinishing) {
    return (
      <div className="view-container" style={{ justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--color-primary)' }}>
            <CheckCircle size={56} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Session Completed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
            You have completed {durationCompleted} minutes of controlled exposure for your health and self-regulation.
          </p>

          <div style={{ borderTop: '1px solid rgba(65, 101, 98, 0.08)', paddingTop: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Final Stress Level (SUDs)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
              Rate the level of stress or anxiety you are currently feeling:
            </p>
            
            <div className="suds-slider-container">
              <div className="suds-indicator" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>{finalSuds}</div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={finalSuds}
                onChange={(e) => setFinalSuds(parseInt(e.target.value))}
                style={{
                  background: 'linear-gradient(90deg, #416562 0%, #725a41 50%, #ba1a1a 100%)',
                }}
              />
              <div className="suds-labels" style={{ fontWeight: '500' }}>
                <span>0 - Completely Calm</span>
                <span>10 - Total Panic</span>
              </div>
              <div className="suds-desc" style={{ fontWeight: '500', color: 'var(--color-primary)', marginTop: '8px' }}>{getSudsDescription(finalSuds)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" style={{ padding: '16px', borderRadius: '9999px', fontWeight: '600' }} onClick={handleSave}>
              Save Session & Finish
            </button>
            <button className="btn btn-secondary" style={{ padding: '16px', borderRadius: '9999px', fontWeight: '600' }} onClick={onCancelSession}>
              Return Without Saving
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      {/* Environment Background Card Header */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '150px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginTop: '10px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        <img 
          src={getEnvImage(settings.exposureType)} 
          alt={getEnvName(settings.exposureType)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8) contrast(1.05) saturate(0.9)',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            padding: '20px 16px',
            background: 'linear-gradient(to top, rgba(253, 249, 246, 0.95) 0%, rgba(253, 249, 246, 0.3) 60%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Active Exposure Environment
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {getEnvName(settings.exposureType)}
            </h2>
          </div>
        </div>
      </div>

      {/* Clinical Phase Progress Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '12px 10px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {phasesList.map((phase) => {
          const isActivePhase = sessionPhase === phase.id;
          return (
            <div 
              key={phase.id} 
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: isActivePhase ? 'var(--color-primary)' : 'rgba(65, 101, 98, 0.12)',
                  boxShadow: isActivePhase ? '0 0 10px rgba(65, 101, 98, 0.4)' : 'none',
                  marginBottom: '8px',
                  transition: 'background-color 0.5s ease',
                }}
              />
              <span 
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isActivePhase ? '700' : '500',
                  color: isActivePhase ? 'var(--color-primary)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-display)'
                }}
              >
                Phase {phase.num}: {phase.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Control Buttons Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '8px 0' }}>
        <button 
          className="btn" 
          style={{ 
            width: '56px', 
            height: '56px', 
            padding: 0, 
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(65, 101, 98, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
          onClick={handleToggleActive}
        >
          {isActive ? <Pause size={24} style={{ color: 'var(--text-primary)' }} /> : <Play size={24} style={{ color: 'var(--text-primary)' }} />}
        </button>
        <button 
          className="btn" 
          style={{ 
            width: '56px', 
            height: '56px', 
            padding: 0, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(65, 101, 98, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-sos)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onClick={handleSessionFinished}
        >
          <Square size={20} fill="currentColor" />
        </button>
      </div>

      {/* Pulsing Breathing Visualizer */}
      <div className="breathing-circle-outer" style={{ margin: '15px auto' }}>
        <div 
          className="breathing-bubble" 
          style={{
            ...breathingCircleStyle,
            transform: `translate(-50%, -50%) ${breathingCircleStyle.transform}`
          }}
        ></div>
        <div className="breathing-circle-inner" style={breathingCircleStyle}>
          <div className="breathing-timer" style={{ fontFamily: 'var(--font-display)' }}>{formatTime(timeLeft)}</div>
          <div className="breathing-text" style={{ fontFamily: 'var(--font-display)', fontWeight: '600' }}>
            {breathState === 'in' ? 'Inhale...' : 'Exhale...'}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>
            {breathCounter}s
          </div>
        </div>
      </div>

      {/* Guide text / Clinical support message */}
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', minHeight: '44px', padding: '0 10px', lineHeight: '1.5' }}>
        {isActive ? (
          <p className="pulse-animation" style={{ fontWeight: '500' }}>
            {breathState === 'in' 
              ? 'Let your lungs fill with soothing air...' 
              : 'Release the tension along with your breath...'}
          </p>
        ) : (
          <p style={{ color: 'var(--color-sos)', fontWeight: '600' }}>Session paused. Take a deep breath and resume when you feel ready.</p>
        )}
      </div>

      {/* Dynamic Phase description card */}
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', borderRadius: '24px', fontSize: '0.9rem', lineHeight: '1.5' }}>
        {sessionPhase === 'opening' && (
          <p style={{ margin: 0, color: 'var(--color-primary)' }}>
            <strong>Preparation & Acclimation:</strong> Settle in comfortably, listen to the opening guidance, and begin regulating your breath.
          </p>
        )}
        {sessionPhase === 'briefing' && (
          <p style={{ margin: 0, color: 'var(--color-secondary)' }}>
            <strong>Guidance Phase:</strong> Background noise rises in a controlled and muffled manner. Keep a calm breathing rhythm.
          </p>
        )}
        {sessionPhase === 'exposure' && (
          <p style={{ margin: 0, color: 'var(--color-sos)' }}>
            <strong>Active Exposure:</strong> Environmental noises have risen to a noticeable volume. Cope safely using your breath anchor.
          </p>
        )}
        {sessionPhase === 'closing' && (
          <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '600' }}>
            <strong>Summary & Relaxation:</strong> Background noises fade towards the end. Listen to the summary and relax your body.
          </p>
        )}
      </div>

      {/* SOS Emergency triggers */}
      <button 
        className="btn btn-sos" 
        style={{ 
          padding: '16px', 
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(186, 26, 26, 0.25)'
        }} 
        onClick={onTriggerSOS}
      >
        <ShieldAlert size={22} />
        Emergency Protocol SOS
      </button>

      {/* Live Audio Adjustments */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '32px' }}>
        <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid rgba(65, 101, 98, 0.08)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
          <Volume2 size={18} />
          Real-time Exposure Control
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '-12px', lineHeight: '1.4' }}>
          If the environment noise is too loud or overwhelming, use the sliders to lower or muffle it instead of stopping.
        </p>

        {/* Live Noise Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Environment Noise Volume</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.noiseVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.noiseVolume}
            onChange={(e) => onSettingsChange({ noiseVolume: parseFloat(e.target.value) })}
            disabled={!isActive}
          />
        </div>

        {/* Live Muffle Filter */}
        <div className="control-group">
          <div className="control-header">
            <span>Noise Muffle</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.muffleLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.muffleLevel}
            onChange={(e) => onSettingsChange({ muffleLevel: parseFloat(e.target.value) })}
            disabled={!isActive}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Clear & Direct</span>
            <span style={{ marginLeft: 'auto' }}>Muffled & Distant</span>
          </div>
        </div>

        {/* Live Music Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Soothing Music Volume</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.musicVolume}
            onChange={(e) => onSettingsChange({ musicVolume: parseFloat(e.target.value) })}
            disabled={!isActive}
          />
        </div>
      </div>
      
      {/* Footer Nav spacer */}
      <div style={{ height: '30px' }}></div>
    </div>
  );
};
