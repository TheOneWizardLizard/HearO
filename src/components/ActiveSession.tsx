import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Play, Pause, Square, CheckCircle, Volume2 } from 'lucide-react';
import type { AudioEngineSettings, ExposureType, SessionPhase } from '../utils/audioEngine';

interface ActiveSessionProps {
  settings: AudioEngineSettings;
  duration: number; // in minutes
  initialSuds: number;
  onSettingsChange: (newSettings: Partial<AudioEngineSettings>) => void;
  onPauseToggle: (isPaused: boolean) => void;
  onTick: (timeLeftSeconds: number) => void;
  onTriggerSOS: () => void;
  onSaveSession: (finalSuds: number, durationCompleted: number) => void;
  onCancelSession: () => void;
  sessionPhase: SessionPhase;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  settings,
  duration,
  initialSuds,
  onSettingsChange,
  onPauseToggle,
  onTick,
  onTriggerSOS,
  onSaveSession,
  onCancelSession,
  sessionPhase,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [breathTick, setBreathTick] = useState(0);
  const breathPhase = breathTick < 4 ? 'inhale' : breathTick < 8 ? 'hold' : 'exhale';
  const breathTimeLeft = breathTick < 4 ? 4 - breathTick : breathTick < 8 ? 8 - breathTick : 12 - breathTick;
  const [isFinishing, setIsFinishing] = useState(false);
  const [finalSuds, setFinalSuds] = useState(initialSuds);
  
  const timerRef = useRef<number | null>(null);
  const onTickRef = useRef(onTick);
  const onPauseToggleRef = useRef(onPauseToggle);

  useEffect(() => {
    onTickRef.current = onTick;
    onPauseToggleRef.current = onPauseToggle;
  }, [onTick, onPauseToggle]);

  const durationCompleted = Math.round(((duration * 60) - timeLeft) / 60 * 10) / 10;

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionFinished();
            return 0;
          }
          const next = prev - 1;
          onTickRef.current(next);
          return next;
        });

        setBreathTick((prev) => (prev + 1) % 12);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleToggleActive = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    onPauseToggleRef.current(!nextActive);
  };

  const handleSessionFinished = () => {
    setIsActive(false);
    onPauseToggleRef.current(true);
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

  const getBreathStyles = () => {
    const transition = 'transform 1s linear, background-color 1s ease, border-color 0.5s ease';
    let scale = 1.0;
    let backgroundColor = 'transparent';
    let borderColor = 'var(--color-border)';

    if (breathPhase === 'inhale') {
      scale = 0.8 + ((4 - breathTimeLeft) / 3) * 0.5;
      backgroundColor = 'var(--color-accent-soft)';
      borderColor = 'var(--color-accent)';
    } else if (breathPhase === 'hold') {
      scale = 1.3;
      backgroundColor = 'rgba(45, 45, 45, 0.05)';
      borderColor = 'var(--color-border)';
    } else {
      scale = 1.3 - ((4 - breathTimeLeft) / 3) * 0.5;
      backgroundColor = 'rgba(200, 121, 65, 0.03)';
      borderColor = 'var(--color-border-subtle)';
    }

    return {
      transform: `scale(${scale})`,
      backgroundColor,
      borderColor,
      transition,
    };
  };

  const getBreathLabel = () => {
    if (breathPhase === 'inhale') return 'Inhale';
    if (breathPhase === 'hold') return 'Hold';
    return 'Exhale';
  };

  const getBreathGuide = () => {
    if (breathPhase === 'inhale') return 'Breathe in slowly through your nose...';
    if (breathPhase === 'hold') return 'Hold the air gently in your lungs...';
    return 'Exhale slowly and fully...';
  };

  const phasesList: { id: SessionPhase; num: number; label: string }[] = [
    { id: 'opening', num: 1, label: 'Prep' },
    { id: 'briefing', num: 2, label: 'Brief' },
    { id: 'exposure', num: 3, label: 'Expose' },
    { id: 'closing', num: 4, label: 'Close' },
  ];

  if (isFinishing) {
    return (
      <div className="view-container" style={{ justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, color: 'var(--color-accent)' }}>
            <CheckCircle size={56} />
          </div>
          
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            Session Completed!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32, lineHeight: '1.5' }}>
            You completed {durationCompleted} minutes of controlled exposure. Well done.
          </p>

          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 24, marginBottom: 32 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Final Stress Level (SUDs)</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 16 }}>
              Rate your current level of stress or anxiety:
            </p>
            
            <div className="suds-slider-container">
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
                {finalSuds}
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={finalSuds}
                onChange={(e) => setFinalSuds(parseInt(e.target.value))}
                style={{
                  background: 'linear-gradient(90deg, #b4c7b5 0%, #dcd3c5 50%, #dca5a5 100%)',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                <span>Calm (0)</span>
                <span>Panic (10)</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8, fontWeight: '500' }}>
                {getSudsDescription(finalSuds)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-filled" onClick={handleSave}>
              Save & Finish
            </button>
            <button className="btn-outline" onClick={onCancelSession}>
              Cancel Without Saving
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10, gap: '16px' }}>
      {/* Environment Header */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '120px',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden',
          border: '1.5px solid var(--color-border)',
          marginTop: 8,
        }}
      >
        <img 
          src={getEnvImage(settings.exposureType)} 
          alt={getEnvName(settings.exposureType)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.9) contrast(1.02) sepia(0.2)',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            padding: '20px 24px',
            background: 'linear-gradient(to top, rgba(242, 236, 228, 0.95) 0%, rgba(242, 236, 228, 0.2) 70%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <div className="section-label">Active Environment</div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)', fontWeight: 400, fontFamily: 'var(--font-display)', marginTop: 4 }}>
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
          border: '1.5px solid var(--color-border)',
          padding: '16px 20px',
          borderRadius: 'var(--border-radius-md)',
          background: 'transparent',
          marginTop: 4,
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
                  height: '4px',
                  borderRadius: '9999px',
                  backgroundColor: isActivePhase ? 'var(--color-accent)' : 'var(--color-border-subtle)',
                  marginBottom: '8px',
                  transition: 'background-color 0.3s ease',
                }}
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isActivePhase ? '600' : '400',
                  color: isActivePhase ? 'var(--text-primary)' : 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Control Buttons Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 12 }}>
        <button
          className="btn-outline"
          style={{
            width: '56px',
            height: '56px',
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleToggleActive}
        >
          {isActive ? <Pause size={20} color="var(--text-primary)" /> : <Play size={20} color="var(--text-primary)" />}
        </button>
        <button
          className="btn-outline sos"
          style={{
            width: '56px',
            height: '56px',
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleSessionFinished}
        >
          <Square size={16} fill="currentColor" />
        </button>
      </div>

      {/* Session Timer */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: '400',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Breathing Circle — 4-4-4 box breathing */}
      <div className="breathing-circle-outer" style={{ margin: '16px auto' }}>
        <div className="breathing-circle-inner" style={getBreathStyles()}>
          <div className="breathing-timer">{breathTimeLeft}</div>
          <div className="breathing-text">{getBreathLabel()}</div>
        </div>
      </div>

      {/* Guide text */}
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', padding: '0 20px', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isActive ? (
          <p style={{ fontWeight: '400', fontStyle: 'italic' }}>
            {getBreathGuide()}
          </p>
        ) : (
          <p style={{ color: 'var(--color-sos)', fontWeight: '500' }}>
            Session paused. Take a moment to recover.
          </p>
        )}
      </div>

      {/* Dynamic Phase description card */}
      <div className="card-subtle" style={{ textAlign: 'center', fontSize: '0.85rem', lineHeight: '1.5' }}>
        {sessionPhase === 'opening' && (
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            <strong>Preparation:</strong> Settle in comfortably, follow the voiceover guide, and steady your breath.
          </p>
        )}
        {sessionPhase === 'briefing' && (
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            <strong>Introduction:</strong> Background noise begins rising softly. Keep your breath slow and steady.
          </p>
        )}
        {sessionPhase === 'exposure' && (
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            <strong>Active Exposure:</strong> Sounds have reached their target level. Anchor yourself to your breathing.
          </p>
        )}
        {sessionPhase === 'closing' && (
          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '500' }}>
            <strong>Closing:</strong> The noise is fading. Take a moment to relax and reflect.
          </p>
        )}
      </div>

      {/* SOS Emergency triggers */}
      <button 
        className="btn-outline sos" 
        style={{ marginTop: 8 }} 
        onClick={onTriggerSOS}
      >
        <ShieldAlert size={18} />
        Emergency SOS Protocol
      </button>

      {/* Live Audio Adjustments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
        <div>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Volume2 size={14} />
            Real-time Exposure Control
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
            Adjust volume and muffle for each layer in real-time.
          </p>
        </div>

        {/* Live Music Volume — only if music is enabled */}
        {settings.musicEnabled && (
          <div className="control-group">
            <div className="control-header">
              <span>🎵 Music Volume</span>
              <span className="control-value">{Math.round(settings.musicVolume * 100)}%</span>
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
        )}

        {/* Live Environment Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>🌿 Environment Volume</span>
            <span className="control-value">{Math.round(settings.noiseVolume * 100)}%</span>
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

        {/* Live Environment Muffle */}
        <div className="control-group">
          <div className="control-header">
            <span>🌿 Environment Muffle</span>
            <span className="control-value">{Math.round(settings.muffleLevel * 100)}%</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Clear</span>
            <span>Muffled</span>
          </div>
        </div>

        {/* Live Trigger Volume — only if a trigger is selected */}
        {settings.selectedTrigger !== 'none' && (
          <>
            <div className="control-group">
              <div className="control-header">
                <span>⚡ Trigger Volume</span>
                <span className="control-value">{Math.round(settings.triggerVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.triggerVolume}
                onChange={(e) => onSettingsChange({ triggerVolume: parseFloat(e.target.value) })}
                disabled={!isActive}
              />
            </div>

            <div className="control-group">
              <div className="control-header">
                <span>⚡ Trigger Muffle</span>
                <span className="control-value">{Math.round(settings.triggerMuffleLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.triggerMuffleLevel}
                onChange={(e) => onSettingsChange({ triggerMuffleLevel: parseFloat(e.target.value) })}
                disabled={!isActive}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>Clear</span>
                <span>Muffled</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Footer Nav spacer */}
      <div style={{ height: '30px' }}></div>
    </div>
  );
};
