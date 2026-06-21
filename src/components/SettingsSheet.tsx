import React, { useRef } from 'react';

interface SettingsSheetProps {
  isOpen: boolean;
  userName: string;
  reminderTime: string;
  reminderEnabled: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onReminderTimeChange: (time: string) => void;
  onReminderToggle: (enabled: boolean) => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  userName,
  reminderTime,
  reminderEnabled,
  onClose,
  onNameChange,
  onReminderTimeChange,
  onReminderToggle,
}) => {
  const timeInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 900,
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: '#f2ece4',
          borderRadius: '24px 24px 0 0',
          padding: '16px 28px 40px',
          zIndex: 901,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: '#c4bdb4',
            borderRadius: 2,
            margin: '0 auto 24px',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            color: '#1a1a1a',
          }}
        >
          Settings
        </div>

        {/* Divider */}
        <div style={{ marginTop: 32 }} />

        {/* YOUR NAME section */}
        <div className="section-label">YOUR NAME</div>
        <input
          type="text"
          value={userName}
          onChange={(e) => onNameChange(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            borderBottom: '1px solid #2d2d2d',
            background: 'transparent',
            padding: '12px 0',
            fontSize: '1rem',
            fontFamily: 'var(--font-family)',
            color: '#1a1a1a',
            outline: 'none',
          }}
        />
        <div
          style={{
            fontSize: '0.8rem',
            color: '#999',
            marginTop: 8,
          }}
        >
          Used in the greeting on the home screen. Optional.
        </div>

        {/* Decorative line divider */}
        <div
          style={{
            width: 40,
            height: 2,
            background: '#2d2d2d',
            marginTop: 32,
            marginBottom: 32,
          }}
        />

        {/* DAILY REMINDER section */}
        <div className="section-label">DAILY REMINDER</div>

        {reminderEnabled ? (
          <>
            <div style={{ fontSize: '1rem', marginTop: 8, color: '#1a1a1a' }}>
              Set for {reminderTime}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 24,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                onClick={() => timeInputRef.current?.showPicker()}
              >
                Change time
              </span>
              <span
                style={{
                  color: '#6b6b6b',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                onClick={() => onReminderToggle(false)}
              >
                Turn off
              </span>
            </div>
            <input
              ref={timeInputRef}
              type="time"
              value={reminderTime}
              onChange={(e) => onReminderTimeChange(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                width: 0,
                height: 0,
              }}
            />
          </>
        ) : (
          <>
            <div style={{ fontSize: '1rem', marginTop: 8, color: '#6b6b6b' }}>
              Disabled
            </div>
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                onClick={() => onReminderToggle(true)}
              >
                Turn on
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
