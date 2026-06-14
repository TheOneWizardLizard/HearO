import React from 'react';
import { Coffee, Car, Waves, Trees, ShieldAlert, Shuffle } from 'lucide-react';
import type { ExposureType, AudioEngineSettings } from '../utils/audioEngine';
import { NOISE_VARIANT_COUNT } from '../utils/audioEngine';

interface SessionSetupProps {
  settings: AudioEngineSettings;
  duration: number; // in minutes
  initialSuds: number;
  onSettingsChange: (newSettings: Partial<AudioEngineSettings>) => void;
  onDurationChange: (duration: number) => void;
  onInitialSudsChange: (suds: number) => void;
  onStartSession: () => void;
  onTriggerSOS: () => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  settings,
  duration,
  initialSuds,
  onSettingsChange,
  onDurationChange,
  onInitialSudsChange,
  onStartSession,
  onTriggerSOS,
}) => {
  const environments: { type: ExposureType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'cafe',
      label: 'Cafe',
      icon: <Coffee size={24} />,
      desc: 'Muffled chatter and clinking cups',
    },
    {
      type: 'street',
      label: 'Busy Street',
      icon: <Car size={24} />,
      desc: 'Car traffic and city bustle',
    },
    {
      type: 'beach',
      label: 'Sea Beach',
      icon: <Waves size={24} />,
      desc: 'Soothing wave sounds and ocean breeze',
    },
    {
      type: 'forest',
      label: 'Quiet Forest',
      icon: <Trees size={24} />,
      desc: 'Rustling leaves, chirping birds, and wind',
    },
  ];

  const getSudsDescription = (val: number): string => {
    if (val <= 2) return 'Calm and relaxed';
    if (val <= 4) return 'Mild tension or slight discomfort';
    if (val <= 6) return 'Moderate tension, noticeable but controlled';
    if (val <= 8) return 'High tension, strong urge to avoid';
    return 'Extreme tension, difficulty concentrating / panic';
  };

  const getSpikeLabel = (val: number): string => {
    if (val === 0) return 'No sudden noises (background only)';
    if (val === 1) return '1 sudden noise during exposure';
    if (val < 5) return `Low frequency (${val} sudden noises)`;
    if (val < 10) return `Medium frequency (${val} sudden noises)`;
    return `High frequency (${val} sudden noises)`;
  };

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      {/* Introduction Card */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '24px 20px', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Session Setup</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Customize your environment for maximum calm. Daily practice helps adapt the brain in a gradual and safe manner.
        </p>
      </div>

      {/* Environment Selector */}
      <div className="control-group">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', paddingLeft: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontWeight: '600' }}>
          Exposure Environment
        </h3>
        <div className="env-grid">
          {environments.map((env, index) => {
            const isActive = settings.exposureType === env.type;
            return (
              <div
                key={env.type}
                className={`env-card ${isActive ? 'active' : ''}`}
                style={{
                  animationDelay: `${index * 0.08}s`,
                  borderColor: isActive ? 'var(--color-primary)' : undefined,
                  backgroundColor: isActive ? 'rgba(65, 101, 98, 0.08)' : undefined,
                }}
                onClick={() => onSettingsChange({ exposureType: env.type })}
              >
                <div 
                  className="env-icon"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(65, 101, 98, 0.08)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    width: '48px',
                    height: '48px',
                  }}
                >
                  {env.icon}
                </div>
                <span className="env-title" style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>{env.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{env.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Noise Variant Selector */}
      <div className="control-group" style={{ padding: '0 4px' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Background Noise Variant
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '9999px',
              backgroundColor: settings.noiseVariantIndex === -1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
              border: settings.noiseVariantIndex === -1 ? '1px solid var(--color-primary)' : '1px solid rgba(65,101,98,0.12)',
              color: settings.noiseVariantIndex === -1 ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => onSettingsChange({ noiseVariantIndex: -1 })}
          >
            <Shuffle size={13} />
            Random
          </button>
          {Array.from({ length: NOISE_VARIANT_COUNT }, (_, i) => (
            <button
              key={i}
              className="btn"
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '9999px',
                backgroundColor: settings.noiseVariantIndex === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                border: settings.noiseVariantIndex === i ? '1px solid var(--color-primary)' : '1px solid rgba(65,101,98,0.12)',
                color: settings.noiseVariantIndex === i ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
              onClick={() => onSettingsChange({ noiseVariantIndex: i })}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
          {settings.noiseVariantIndex === -1
            ? 'A different noise variant will be selected for each session'
            : `Variant ${settings.noiseVariantIndex + 1} selected`}
        </span>
      </div>

      {/* Advanced Audio Controls */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', borderBottom: '1px solid rgba(65, 101, 98, 0.08)', paddingBottom: '12px', fontFamily: 'var(--font-display)' }}>
          Audio Controls
        </h3>

        {/* Music Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Soothing Music</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.musicVolume}
            onChange={(e) => onSettingsChange({ musicVolume: parseFloat(e.target.value) })}
          />
        </div>

        {/* Noise Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Background Noise</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.noiseVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.noiseVolume}
            onChange={(e) => onSettingsChange({ noiseVolume: parseFloat(e.target.value) })}
          />
        </div>

        {/* Muffle Level */}
        <div className="control-group">
          <div className="control-header">
            <span>Noise Muffle Level</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{Math.round(settings.muffleLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.muffleLevel}
            onChange={(e) => onSettingsChange({ muffleLevel: parseFloat(e.target.value) })}
          />
          <span className="control-desc">
            High muffle attenuates high frequencies, providing a feeling of noise cancellation and distance.
          </span>
        </div>

        {/* Spike Triggers Count */}
        <div className="control-group">
          <div className="control-header">
            <span>Sudden Noises per Session</span>
            <span className="control-value" style={{ fontWeight: '600' }}>{settings.spikeCount}</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={settings.spikeCount}
            onChange={(e) => onSettingsChange({ spikeCount: parseInt(e.target.value) })}
          />
          <span className="control-desc" style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>
            Status: {getSpikeLabel(settings.spikeCount)}
          </span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="glass-panel" style={{ padding: '24px 20px', borderRadius: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Guidance Language</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px' }}>
          Select the voiceover language during the meditation and exposure phases:
        </p>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(65, 101, 98, 0.06)', padding: '4px', borderRadius: '9999px' }}>
          <button
            className={`pill-btn ${settings.voiceoverLanguage === 'he' ? 'active' : ''}`}
            style={{
              padding: '12px 0',
              borderRadius: '9999px',
              fontWeight: settings.voiceoverLanguage === 'he' ? '600' : '400',
              boxShadow: settings.voiceoverLanguage === 'he' ? '0 2px 8px rgba(65, 101, 98, 0.08)' : 'none',
            }}
            onClick={() => onSettingsChange({ voiceoverLanguage: 'he' })}
          >
            Hebrew
          </button>
          <button
            className={`pill-btn ${settings.voiceoverLanguage === 'en' ? 'active' : ''}`}
            style={{
              padding: '12px 0',
              borderRadius: '9999px',
              fontWeight: settings.voiceoverLanguage === 'en' ? '600' : '400',
              boxShadow: settings.voiceoverLanguage === 'en' ? '0 2px 8px rgba(65, 101, 98, 0.08)' : 'none',
            }}
            onClick={() => onSettingsChange({ voiceoverLanguage: 'en' })}
          >
            English
          </button>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="glass-panel" style={{ padding: '24px 20px', borderRadius: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Session Duration (Minutes)</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[3, 5, 10, 15].map((mins) => {
            const isSelected = duration === mins;
            return (
              <button
                key={mins}
                className="btn"
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.5)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(65, 101, 98, 0.12)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: isSelected ? '0 4px 12px rgba(65, 101, 98, 0.2)' : 'none',
                }}
                onClick={() => onDurationChange(mins)}
              >
                {mins}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUDs Stress rating */}
      <div className="glass-panel" style={{ padding: '24px 20px', borderRadius: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Current State (Stress/Anxiety)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px' }}>
          Rate the level of stress or anxiety you are currently experiencing:
        </p>
        <div className="suds-slider-container">
          <div className="suds-indicator" style={{ fontFamily: 'var(--font-display)' }}>{initialSuds}</div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={initialSuds}
            onChange={(e) => onInitialSudsChange(parseInt(e.target.value))}
            style={{
              background: 'linear-gradient(90deg, #416562 0%, #725a41 50%, #ba1a1a 100%)',
            }}
          />
          <div className="suds-labels" style={{ fontWeight: '500' }}>
            <span>Calm (0)</span>
            <span>Panic (10)</span>
          </div>
          <div className="suds-desc" style={{ fontWeight: '500', color: 'var(--color-primary)', marginTop: '8px' }}>{getSudsDescription(initialSuds)}</div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        className="btn btn-primary" 
        style={{ 
          padding: '18px', 
          fontSize: '1.15rem', 
          fontWeight: '600', 
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(65, 101, 98, 0.25)' 
        }} 
        onClick={onStartSession}
      >
        Start Session
      </button>

      {/* Emergency Button */}
      <button 
        className="btn btn-sos" 
        style={{ 
          marginTop: '6px', 
          padding: '16px', 
          borderRadius: '9999px',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }} 
        onClick={onTriggerSOS}
      >
        <ShieldAlert size={22} />
        Emergency Protocol SOS
      </button>
      
      {/* Footer Nav spacer */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
};
