import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, Check, Heart, VolumeX, ArrowLeft } from 'lucide-react';

interface EmergencyProtocolProps {
  onCloseSOS: () => void;
  onExitSession: () => void;
}

export const EmergencyProtocol: React.FC<EmergencyProtocolProps> = ({
  onCloseSOS,
  onExitSession,
}) => {
  const [sosTab, setSosTab] = useState<'breathe' | 'grounding' | 'contacts'>('breathe');
  
  // 4-7-8 Breathing states
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breatheTimeLeft, setBreatheTimeLeft] = useState(4); // Start with 4s inhale
  const breatheTimerRef = useRef<number | null>(null);

  // 5-4-3-2-1 Grounding States
  const [groundingSteps, setGroundingSteps] = useState([
    { id: 5, text: 'Things you see around you', desc: 'Look around and find 5 different objects (e.g., lamp, picture, chair).', completed: false },
    { id: 4, text: 'Things you can physically feel', desc: 'Pay attention to 4 physical touch sensations (e.g., clothing on skin, feet on the floor).', completed: false },
    { id: 3, text: 'Things you hear right now', desc: 'Listen closely and find 3 sounds (e.g., air conditioning hum, distant buzz, birds chirping).', completed: false },
    { id: 2, text: 'Things you can smell', desc: 'Notice 2 scents in your environment (e.g., coffee smell, perfume, or just clean air).', completed: false },
    { id: 1, text: 'One thing you can taste', desc: 'Notice the taste in your mouth or take a sip of water to feel one taste.', completed: false },
  ]);

  // Personal Emergency Contact state
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Close Friend / Family Member',
    phone: '',
  });
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Load personal contact from localStorage
  useEffect(() => {
    const savedContact = localStorage.getItem('hearo_emergency_contact');
    if (savedContact) {
      try {
        setEmergencyContact(JSON.parse(savedContact));
      } catch (e) {}
    }
  }, []);

  const saveEmergencyContact = (name: string, phone: string) => {
    const newContact = { name, phone };
    setEmergencyContact(newContact);
    localStorage.setItem('hearo_emergency_contact', JSON.stringify(newContact));
    setIsEditingContact(false);
  };

  // 4-7-8 Breathing logic loop
  useEffect(() => {
    breatheTimerRef.current = window.setInterval(() => {
      setBreatheTimeLeft((prev) => {
        if (prev <= 1) {
          if (breathePhase === 'inhale') {
            setBreathePhase('hold');
            return 7; // Hold for 7s
          } else if (breathePhase === 'hold') {
            setBreathePhase('exhale');
            return 8; // Exhale for 8s
          } else {
            setBreathePhase('inhale');
            return 4; // Inhale for 4s
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breatheTimerRef.current) clearInterval(breatheTimerRef.current);
    };
  }, [breathePhase]);

  const handleToggleGroundingCard = (id: number) => {
    setGroundingSteps((steps) =>
      steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  // Circular breathing styles for 4-7-8
  const getBreatheStyles = () => {
    let scale = 1.0;
    let backgroundColor = 'transparent';
    let borderColor = 'var(--color-border)';

    if (breathePhase === 'inhale') {
      scale = 0.8 + ((4 - breatheTimeLeft) / 4) * 0.5; // Scale 0.8 to 1.3
      backgroundColor = 'var(--color-accent-soft)';
      borderColor = 'var(--color-accent)';
    } else if (breathePhase === 'hold') {
      scale = 1.3;
      backgroundColor = 'rgba(45, 45, 45, 0.05)';
      borderColor = 'var(--color-border)';
    } else {
      scale = 1.3 - ((8 - breatheTimeLeft) / 8) * 0.5; // Scale 1.3 to 0.8
      backgroundColor = 'rgba(200, 121, 65, 0.03)';
      borderColor = 'var(--color-border-subtle)';
    }

    return {
      transform: `scale(${scale})`,
      backgroundColor,
      borderColor,
    };
  };

  const getBreatheLabel = () => {
    if (breathePhase === 'inhale') return 'Inhale';
    if (breathePhase === 'hold') return 'Hold';
    return 'Exhale';
  };

  const getBreatheSubText = () => {
    if (breathePhase === 'inhale') return 'Take a deep and slow breath through your nose';
    if (breathePhase === 'hold') return 'Allow the body to settle and rest';
    return 'Exhale slowly through your mouth';
  };

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      
      {/* SOS Alert Bar */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          border: '1.5px solid var(--color-sos)', 
          background: 'var(--color-sos-soft)',
          padding: '16px 20px',
          borderRadius: 'var(--border-radius-md)',
        }}
      >
        <div style={{ color: 'var(--color-sos)', display: 'flex', alignItems: 'center' }}>
          <VolumeX size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-sos)', fontWeight: 400, fontFamily: 'var(--font-display)' }}>
            SOS Emergency Protocol
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginTop: 2 }}>
            Environmental noises have been completely muted. Take a deep breath. We are here with you.
          </p>
        </div>
      </div>

      {/* Navigation tabs for SOS sub-modes */}
      <div className="nav-tabs" style={{ marginTop: 8 }}>
        <button 
          className={`tab-btn ${sosTab === 'breathe' ? 'active' : ''}`}
          onClick={() => setSosTab('breathe')}
        >
          4-7-8 Breathing
        </button>
        <button 
          className={`tab-btn ${sosTab === 'grounding' ? 'active' : ''}`}
          onClick={() => setSosTab('grounding')}
        >
          Grounding Exercise
        </button>
        <button 
          className={`tab-btn ${sosTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setSosTab('contacts')}
        >
          Helplines
        </button>
      </div>

      {/* Screen Views */}
      <div style={{ flex: 1, marginTop: 12 }}>
        {sosTab === 'breathe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Calming Breath</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px', margin: '6px auto 0', lineHeight: '1.4' }}>
                4-7-8 breathing helps slow your heart rate and activate your body's natural relaxation response.
              </p>
            </div>

            {/* 4-7-8 Breathing Circle */}
            <div className="breathing-circle-outer" style={{ margin: '12px auto' }}>
              <div className="breathing-circle-inner" style={getBreatheStyles()}>
                <div className="breathing-timer">{breatheTimeLeft}</div>
                <div className="breathing-text">
                  {getBreatheLabel()}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '400', fontStyle: 'italic' }}>
                {getBreatheSubText()}
              </span>
            </div>

            <div className="card-subtle" style={{ width: '100%', fontSize: '0.85rem' }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Exercise Steps</div>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                <li style={{ fontWeight: breathePhase === 'inhale' ? '600' : '400', color: breathePhase === 'inhale' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  1. Inhale air quietly through your nose for 4 seconds.
                </li>
                <li style={{ fontWeight: breathePhase === 'hold' ? '600' : '400', color: breathePhase === 'hold' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  2. Hold your breath and keep the air in your lungs for 7 seconds.
                </li>
                <li style={{ fontWeight: breathePhase === 'exhale' ? '600' : '400', color: breathePhase === 'exhale' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  3. Exhale completely through your mouth with a soft whoosh for 8 seconds.
                </li>
              </ul>
            </div>
          </div>
        )}

        {sosTab === 'grounding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>5-4-3-2-1 Grounding</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', lineHeight: '1.4' }}>
                Focusing on the external environment using your senses helps bring attention back to the present moment and reduce emotional overwhelm.
              </p>
            </div>

            {/* Grounding Exercise List */}
            <div className="grounding-deck">
              {groundingSteps.map((step) => (
                <div 
                  key={step.id} 
                  className={`grounding-card ${step.completed ? 'completed' : ''}`}
                  onClick={() => handleToggleGroundingCard(step.id)}
                >
                  <div className="grounding-num" style={{ fontFamily: 'var(--font-display)' }}>{step.id}</div>
                  <div className="grounding-content">
                    <h4 style={{ color: step.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: '500', fontSize: '0.95rem' }}>
                      {step.text}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{step.desc}</p>
                  </div>
                  <div className="grounding-check">
                    {step.completed && <Check size={12} />}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn-outline" 
              style={{ marginTop: '12px' }}
              onClick={() => setGroundingSteps(steps => steps.map(s => ({ ...s, completed: false })))}
            >
              Reset Grounding Exercise
            </button>
          </div>
        )}

        {sosTab === 'contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', textAlign: 'center', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Support Helplines</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '6px', lineHeight: '1.4' }}>
                Remember that you are not alone. Professionals and volunteers are available to talk with you now.
              </p>
            </div>

            {/* Hotline Buttons */}
            <div className="emergency-contacts">
              <div className="section-label" style={{ marginBottom: 6 }}>Support Lines (Anonymous & Free)</div>
              
              <a href="tel:1201" className="contact-btn">
                <div className="contact-btn-left">
                  <Phone size={16} />
                  <span>ERAN - Emotional First Aid</span>
                </div>
                <span className="contact-btn-number" style={{ fontFamily: 'var(--font-display)' }}>1201</span>
              </a>

              <a href="tel:1800363363" className="contact-btn">
                <div className="contact-btn-left">
                  <Phone size={16} />
                  <span>NATAL - Trauma Helpline</span>
                </div>
                <span className="contact-btn-number" style={{ fontFamily: 'var(--font-display)' }}>1-800-363-363</span>
              </a>
            </div>

            {/* Personal Contact */}
            <div className="card-subtle" style={{ padding: '20px 24px' }}>
              <div className="section-label" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={14} style={{ color: 'var(--color-sos)' }} />
                Personal Contact
              </div>

              {isEditingContact ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  saveEmergencyContact(
                    formData.get('name') as string || 'Emergency Contact',
                    formData.get('phone') as string || ''
                  );
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Contact Name"
                    defaultValue={emergencyContact.name}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '1.5px solid var(--color-border)',
                      background: 'transparent',
                      padding: '12px 0',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-family)',
                      color: '#1a1a1a',
                      outline: 'none',
                    }}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    defaultValue={emergencyContact.phone}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '1.5px solid var(--color-border)',
                      background: 'transparent',
                      padding: '12px 0',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-family)',
                      color: '#1a1a1a',
                      outline: 'none',
                    }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: 8 }}>
                    <button type="submit" className="btn-filled" style={{ flex: 1 }}>Save</button>
                    <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setIsEditingContact(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)' }}>{emergencyContact.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {emergencyContact.phone || 'No number defined'}
                      </div>
                    </div>
                    <button 
                      className="pill-btn" 
                      onClick={() => setIsEditingContact(true)}
                    >
                      Edit
                    </button>
                  </div>
                  
                  {emergencyContact.phone && (
                    <a href={`tel:${emergencyContact.phone}`} className="btn-filled" style={{ textDecoration: 'none' }}>
                      <Phone size={16} />
                      Call {emergencyContact.name}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom SOS Control Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <button 
          className="btn-filled" 
          onClick={onCloseSOS}
        >
          <ShieldCheck size={18} />
          I feel better - Return to session
        </button>

        <button 
          className="btn-outline"
          onClick={onExitSession}
        >
          <ArrowLeft size={16} />
          Cancel session & Exit
        </button>
      </div>

    </div>
  );
};
