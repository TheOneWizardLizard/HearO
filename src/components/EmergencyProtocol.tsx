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
    { id: 5, text: 'דברים שאתה רואה סביבך', desc: 'התבונן סביב ומצא 5 חפצים שונים (כמו מנורה, תמונה, כיסא).', completed: false },
    { id: 4, text: 'דברים שאתה יכול לחוש בגוף', desc: 'שים לב ל-4 תחושות מגע פיזיות (כמו הבגד על העור, כפות הרגליים על הרצפה).', completed: false },
    { id: 3, text: 'דברים שאתה שומע ברגע זה', desc: 'הקשב היטב ומצא 3 קולות (כמו רעש מזגן, זמזום מרחוק, ציוץ ציפורים).', completed: false },
    { id: 2, text: 'דברים שאתה יכול להריח', desc: 'שים לב ל-2 ריחות בסביבה שלך (כמו ריח קפה, בושם או פשוט אוויר נקי).', completed: false },
    { id: 1, text: 'דבר אחד שאתה יכול לטעום', desc: 'שים לב לטעם בפה או קח שלוק מים כדי לחוש בטעם אחד.', completed: false },
  ]);

  // Personal Emergency Contact state
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'חבר קרוב / בן משפחה',
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
          // Switch phase
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
    if (breathePhase === 'inhale') {
      const scale = 1.0 + ((4 - breatheTimeLeft) / 4) * 0.48; // Scale 1.0 to 1.48
      return {
        transform: `scale(${scale})`,
        backgroundColor: 'rgba(65, 101, 98, 0.08)',
        boxShadow: '0 0 30px rgba(65, 101, 98, 0.2)',
        borderColor: 'var(--color-primary)',
        transition: 'transform 1s linear, background-color 1s ease, box-shadow 1s ease',
      };
    } else if (breathePhase === 'hold') {
      return {
        transform: 'scale(1.48)',
        backgroundColor: 'rgba(114, 90, 65, 0.08)',
        boxShadow: '0 0 40px rgba(114, 90, 65, 0.2)',
        borderColor: 'var(--color-secondary)',
        transition: 'transform 1s linear, background-color 1s ease, box-shadow 1s ease',
      };
    } else {
      const scale = 1.48 - ((8 - breatheTimeLeft) / 8) * 0.48; // Scale 1.48 to 1.0
      return {
        transform: `scale(${scale})`,
        backgroundColor: 'rgba(69, 98, 117, 0.08)',
        boxShadow: '0 0 25px rgba(69, 98, 117, 0.15)',
        borderColor: 'var(--color-accent)',
        transition: 'transform 1s linear, background-color 1s ease, box-shadow 1s ease',
      };
    }
  };

  const getBreatheLabel = () => {
    if (breathePhase === 'inhale') return 'שאף פנימה';
    if (breathePhase === 'hold') return 'החזק';
    return 'נשוף החוצה';
  };

  const getBreatheSubText = () => {
    if (breathePhase === 'inhale') return 'קח נשימה עמוקה ואיטית מהאף';
    if (breathePhase === 'hold') return 'אפשר לגוף לשקוט';
    return 'נשוף באיטיות תוך כיווץ השפתיים';
  };

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      
      {/* SOS Alert Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          borderColor: 'var(--color-sos)', 
          background: 'rgba(186, 26, 26, 0.05)',
          padding: '16px 20px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(186, 26, 26, 0.05)'
        }}
      >
        <div style={{ color: 'var(--color-sos)' }}>
          <VolumeX size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-sos)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>נוהל חירום SOS</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            רעשי הסביבה הושתקו לחלוטין. אנחנו כאן איתך, קח נשימה עמוקה.
          </p>
        </div>
      </div>

      {/* Navigation tabs for SOS sub-modes */}
      <div className="nav-tabs" style={{ background: 'rgba(65, 101, 98, 0.06)', borderRadius: '9999px', padding: '4px' }}>
        <button 
          className={`tab-btn ${sosTab === 'breathe' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            borderRadius: '9999px',
            backgroundColor: sosTab === 'breathe' ? 'var(--color-primary)' : 'transparent',
            color: sosTab === 'breathe' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: sosTab === 'breathe' ? '600' : '400',
            boxShadow: sosTab === 'breathe' ? '0 2px 8px rgba(65, 101, 98, 0.15)' : 'none',
          }}
          onClick={() => setSosTab('breathe')}
        >
          נשימת 4-7-8
        </button>
        <button 
          className={`tab-btn ${sosTab === 'grounding' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            borderRadius: '9999px',
            backgroundColor: sosTab === 'grounding' ? 'var(--color-primary)' : 'transparent',
            color: sosTab === 'grounding' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: sosTab === 'grounding' ? '600' : '400',
            boxShadow: sosTab === 'grounding' ? '0 2px 8px rgba(65, 101, 98, 0.15)' : 'none',
          }}
          onClick={() => setSosTab('grounding')}
        >
          תרגיל קרקוע
        </button>
        <button 
          className={`tab-btn ${sosTab === 'contacts' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            borderRadius: '9999px',
            backgroundColor: sosTab === 'contacts' ? 'var(--color-primary)' : 'transparent',
            color: sosTab === 'contacts' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: sosTab === 'contacts' ? '600' : '400',
            boxShadow: sosTab === 'contacts' ? '0 2px 8px rgba(65, 101, 98, 0.15)' : 'none',
          }}
          onClick={() => setSosTab('contacts')}
        >
          קווי סיוע
        </button>
      </div>

      {/* Screen Views */}
      {sosTab === 'breathe' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>נשימה מרגיעה</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px', margin: '6px auto 0', lineHeight: '1.4' }}>
              נשימה בקצב 4-7-8 מסייעת להאט את דופק הלב ולהפעיל את מנגנון הרגיעה הטבעי בגוף.
            </p>
          </div>

          {/* 4-7-8 Breathing Circle */}
          <div className="breathing-circle-outer" style={{ width: '220px', height: '220px', margin: '10px auto' }}>
            <div className="breathing-circle-inner" style={{ width: '130px', height: '130px', ...getBreatheStyles(), border: '1px solid rgba(255,255,255,0.4)' }}>
              <div className="breathing-timer" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)' }}>{breatheTimeLeft}</div>
              <div className="breathing-text" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
                {getBreatheLabel()}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', minHeight: '50px' }}>
            <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              {getBreatheSubText()}
            </span>
          </div>

          <div className="glass-panel" style={{ width: '100%', fontSize: '0.85rem', padding: '20px', borderRadius: '24px' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '8px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>שלבי התרגיל:</h4>
            <ul style={{ paddingRight: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
              <li style={{ fontWeight: breathePhase === 'inhale' ? '700' : '400', color: breathePhase === 'inhale' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                1. שאף אוויר דרך האף בצורה חרישית במשך 4 שניות.
              </li>
              <li style={{ fontWeight: breathePhase === 'hold' ? '700' : '400', color: breathePhase === 'hold' ? 'var(--color-secondary)' : 'var(--text-secondary)' }}>
                2. עצור את הנשימה והחזק את האוויר בריאות במשך 7 שניות.
              </li>
              <li style={{ fontWeight: breathePhase === 'exhale' ? '700' : '400', color: breathePhase === 'exhale' ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
                3. נשוף את כל האוויר החוצה דרך הפה עם צליל ״פווו״ במשך 8 שניות.
              </li>
            </ul>
          </div>
        </div>
      )}

      {sosTab === 'grounding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>קרקוע 5-4-3-2-1</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', lineHeight: '1.4' }}>
              התמקדות בסביבה החיצונית באמצעות החושים מסייעת להחזיר את תשומת הלב לרגע ההווה ולהפחית הצפה רגשית.
            </p>
          </div>

          {/* Interactive Card Deck */}
          <div className="grounding-deck">
            {groundingSteps.map((step) => (
              <div 
                key={step.id} 
                className={`grounding-card ${step.completed ? 'completed' : ''}`}
                style={{
                  borderRadius: '20px',
                  backgroundColor: step.completed ? 'rgba(65, 101, 98, 0.05)' : 'rgba(255, 255, 255, 0.45)',
                  borderColor: step.completed ? 'rgba(65, 101, 98, 0.3)' : 'rgba(65, 101, 98, 0.08)',
                }}
                onClick={() => handleToggleGroundingCard(step.id)}
              >
                <div className="grounding-num" style={{ fontFamily: 'var(--font-display)' }}>{step.id}</div>
                <div className="grounding-content">
                  <h4 style={{ color: step.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
                    {step.text}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
                <div className="grounding-check" style={{ borderColor: 'rgba(65, 101, 98, 0.2)' }}>
                  {step.completed && <Check size={12} />}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '10px', borderRadius: '9999px', padding: '12px' }}
            onClick={() => setGroundingSteps(steps => steps.map(s => ({ ...s, completed: false })))}
          >
            איפוס תרגיל קרקוע
          </button>
        </div>
      )}

      {sosTab === 'contacts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', textAlign: 'center', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>סיוע ותמיכה נפשית</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '4px', lineHeight: '1.4' }}>
              זכור שאתה לא לבד. אם אתה מרגיש צורך לדבר עם מישהו, אנשי מקצוע ומתנדבים זמינים עבורך כעת.
            </p>
          </div>

          {/* Hotline Buttons */}
          <div className="emergency-contacts">
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', paddingRight: '4px' }}>קווי סיוע בישראל (שיחה אנונימית חינם)</h4>
            
            <a href="tel:1201" className="contact-btn" style={{ borderRadius: '20px' }}>
              <div className="contact-btn-left">
                <Phone size={18} />
                <span>ער״ן - עזרה ראשונה נפשית</span>
              </div>
              <span className="contact-btn-number" style={{ fontFamily: 'var(--font-display)' }}>1201</span>
            </a>

            <a href="tel:1800363363" className="contact-btn" style={{ borderRadius: '20px' }}>
              <div className="contact-btn-left">
                <Phone size={18} />
                <span>נט״ל - סיוע לנפגעי טראומה</span>
              </div>
              <span className="contact-btn-number" style={{ fontFamily: 'var(--font-display)' }}>1-800-363-363</span>
            </a>
          </div>

          {/* Personal Contact */}
          <div className="glass-panel" style={{ padding: '24px 20px', borderRadius: '32px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
              <Heart size={16} style={{ color: 'var(--color-sos)' }} />
              איש קשר אישי לחירום
            </h4>

            {isEditingContact ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                saveEmergencyContact(
                  formData.get('name') as string || 'איש קשר לחירום',
                  formData.get('phone') as string || ''
                );
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="שם איש הקשר"
                  defaultValue={emergencyContact.name}
                  className="btn btn-secondary"
                  style={{ textAlign: 'right', cursor: 'text', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(65, 101, 98, 0.12)' }}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="מספר טלפון"
                  defaultValue={emergencyContact.phone}
                  className="btn btn-secondary hebrew-direction-override"
                  style={{ textAlign: 'left', cursor: 'text', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(65, 101, 98, 0.12)' }}
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '9999px' }}>שמור</button>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '9999px' }} onClick={() => setIsEditingContact(false)}>ביטול</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{emergencyContact.name}</div>
                    <div className="hebrew-direction-override" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right', fontFamily: 'var(--font-display)' }}>
                      {emergencyContact.phone || 'לא הוגדר מספר'}
                    </div>
                  </div>
                  <button 
                    className="tab-btn" 
                    style={{ backgroundColor: 'rgba(65, 101, 98, 0.08)', borderRadius: '9999px', padding: '6px 16px' }} 
                    onClick={() => setIsEditingContact(true)}
                  >
                    ערוך
                  </button>
                </div>
                
                {emergencyContact.phone && (
                  <a href={`tel:${emergencyContact.phone}`} className="btn btn-primary" style={{ borderRadius: '9999px', boxShadow: 'none' }}>
                    <Phone size={18} />
                    חייג אל {emergencyContact.name}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom SOS Control Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <button 
          className="btn btn-primary" 
          style={{ 
            padding: '16px', 
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(65, 101, 98, 0.2)'
          }}
          onClick={onCloseSOS}
        >
          <ShieldCheck size={20} />
          אני מרגיש יותר טוב - חזור לסשן
        </button>

        <button 
          className="btn btn-secondary"
          style={{ borderRadius: '9999px' }}
          onClick={onExitSession}
        >
          <ArrowLeft size={16} />
          סיים סשן וחזור לדאשבורד
        </button>
      </div>

    </div>
  );
};
