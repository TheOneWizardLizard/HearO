export type ExposureType = 'cafe' | 'street' | 'beach' | 'forest';

export type SessionPhase = 'opening' | 'briefing' | 'exposure' | 'closing';

export type TriggerType = 'motorcycle' | 'doorSlam' | 'fireworks' | 'dog' | 'helicopter' | 'restaurant' | 'siren' | 'horn' | 'baby' | 'none';

export const TRIGGER_TYPES: { type: TriggerType; label: string }[] = [
  { type: 'motorcycle', label: 'Motorcycle' },
  { type: 'doorSlam', label: 'Door Slam' },
  { type: 'fireworks', label: 'Fireworks' },
  { type: 'dog', label: 'Barking Dog' },
  { type: 'helicopter', label: 'Helicopter' },
  { type: 'restaurant', label: 'Restaurant' },
  { type: 'siren', label: 'Siren' },
  { type: 'horn', label: 'Car Horn' },
  { type: 'baby', label: 'Crying Baby' },
  { type: 'none', label: 'None' },
];

export interface AudioEngineSettings {
  musicEnabled: boolean;    // Toggle background melody on/off
  musicVolume: number;      // 0.0 - 1.0
  noiseVolume: number;      // 0.0 - 1.0
  muffleLevel: number;      // 0.0 - 1.0 (1 = fully muffled, 0 = clear)
  spikeFrequency: number;   // 0.0 - 1.0 (Deprecated/compatibility)
  spikeCount: number;       // 0 to 15 triggers per session
  exposureType: ExposureType;
  voiceoverLanguage?: 'he' | 'en';
  noiseVariantIndex: number; // 0-3 = specific variant, -1 = random each session
  selectedTrigger: TriggerType;   // Which trigger to use
  triggerVolume: number;          // 0.0 - 1.0
  triggerMuffleLevel: number;     // 0.0 - 1.0 (1 = fully muffled, 0 = clear)
}

export const NOISE_VARIANT_COUNT = 4;

const BACKGROUND_NOISES = {
  cafe: [
    '/media/רעשי רקע/בית קפה/Realistic_indoor_cof__1-1780143636373.mp3',
    '/media/רעשי רקע/בית קפה/Realistic_indoor_cof__2-1780143636374.mp3',
    '/media/רעשי רקע/בית קפה/Realistic_indoor_cof__3-1780143636374.mp3',
    '/media/רעשי רקע/בית קפה/Realistic_indoor_cof__4-1780143637364.mp3',
  ],
  street: [
    '/media/רעשי רקע/רחוב/Steady_urban_city_st__1-1780143711219.mp3',
    '/media/רעשי רקע/רחוב/Steady_urban_city_st__2-1780143711220.mp3',
    '/media/רעשי רקע/רחוב/Steady_urban_city_st__3-1780143711220.mp3',
    '/media/רעשי רקע/רחוב/Steady_urban_city_st__4-1780143711220.mp3',
  ],
  beach: [
    '/media/רעשי רקע/ים/Soothing_ocean_shore__1-1780143780490.mp3',
    '/media/רעשי רקע/ים/Soothing_ocean_shore__2-1780143780491.mp3',
    '/media/רעשי רקע/ים/Soothing_ocean_shore__3-1780143780491.mp3',
    '/media/רעשי רקע/ים/Soothing_ocean_shore__4-1780143781749.mp3',
  ],
  forest: [
    '/media/רעשי רקע/יער/Immersive_outdoor_so__1-1780143574058.mp3',
    '/media/רעשי רקע/יער/Immersive_outdoor_so__2-1780143574059.mp3',
    '/media/רעשי רקע/יער/Immersive_outdoor_so__3-1780143574059.mp3',
    '/media/רעשי רקע/יער/Immersive_outdoor_so__4-1780143574060.mp3',
  ],
};

const MUSIC_FILES = {
  cafe: '/media/שמע/פאדים מרחפים (מתאים במיוחד לבית קפה ורחוב - מבודד רעשים).mp3',
  street: '/media/שמע/פאדים מרחפים (מתאים במיוחד לבית קפה ורחוב - מבודד רעשים).mp3',
  beach: '/media/שמע/פסנתר אקוסטי חם (מתאים במיוחד לים וליער).mp3',
  forest: '/media/שמע/פסנתר אקוסטי חם (מתאים במיוחד לים וליער).mp3',
  default: '/media/שמע/נאו-קלאסי מנחם (פסנתר וסטרינגס).mp3',
};

const VOICEOVERS = {
  he: {
    cafe: {
      opening: '/media/דיבוב/בית קפה/התחלה בית קפה עברית.mp3',
      middle: '/media/דיבוב/בית קפה/אמצע בית קפה עברית.mp3',
      closing: '/media/דיבוב/בית קפה/סוף בית קפה עברית.mp3',
    },
    street: {
      opening: '/media/דיבוב/רחוב/התחלה רחוב עברית.mp3',
      middle: '/media/דיבוב/רחוב/אמצע רחוב עברית.mp3',
      closing: '/media/דיבוב/רחוב/סוף רחוב עברית.mp3',
    },
    beach: {
      opening: '/media/דיבוב/ים/פתיח ים עברית.mp3',
      middle: '/media/דיבוב/ים/אמצע ים עברית.mp3',
      closing: '/media/דיבוב/ים/סיכום ים עברית.mp3',
    },
    forest: {
      opening: '/media/דיבוב/יער/התחלה יער עברית.mp3',
      middle: '/media/דיבוב/יער/אמצע יער עברית.mp3',
      closing: '/media/דיבוב/יער/סוף יער עברית.mp3',
    },
  },
  en: {
    cafe: {
      opening: '/media/דיבוב/בית קפה/התחלה בית קפה אנגלית.mp3',
      middle: '/media/דיבוב/בית קפה/אמצע בית קפה אנגלית.mp3',
      closing: '/media/דיבוב/בית קפה/סוף בית קפה אנגלית.mp3',
    },
    street: {
      opening: '/media/דיבוב/רחוב/התחלה רחוב אנגלית.mp3',
      middle: '/media/דיבוב/רחוב/אמצע רחוב אנגלית.mp3',
      closing: '/media/דיבוב/רחוב/סוף רחוב אנגלית.mp3',
    },
    beach: {
      opening: '/media/דיבוב/ים/פתיח ים אנגלית.mp3',
      middle: '/media/דיבוב/ים/אמצע ים אנגלית.mp3',
      closing: '/media/דיבוב/ים/סיום ים אנגלית.mp3',
    },
    forest: {
      opening: '/media/דיבוב/יער/התחלה יער אנגלית.mp3',
      middle: '/media/דיבוב/יער/אמצע יער אנגלית.mp3',
      closing: '/media/דיבוב/יער/סוף יער אנגלית.mp3',
    },
  },
};

const TRIGGERS = {
  motorcycle: [
    '/media/טריגרים/אופנוע/A_realistic,_isolate__1-1779986103902.mp3',
    '/media/טריגרים/אופנוע/A_realistic,_isolate__2-1779986104004.mp3',
    '/media/טריגרים/אופנוע/A_realistic,_isolate__3-1779986104086.mp3',
    '/media/טריגרים/אופנוע/A_realistic,_isolate__4-1779986110519.mp3',
  ],
  doorSlam: [
    '/media/טריגרים/דלת נתרקת /A_sudden,_heavy,_and__1-1779986085575.mp3',
    '/media/טריגרים/דלת נתרקת /A_sudden,_heavy,_and__2-1779986085610.mp3',
    '/media/טריגרים/דלת נתרקת /A_sudden,_heavy,_and__3-1779986090270.mp3',
    '/media/טריגרים/דלת נתרקת /A_sudden,_heavy,_and__4-1779986092452.mp3',
  ],
  fireworks: [
    '/media/טריגרים/זיקוקים/A_series_of_sharp,_e__1-1779986072503.mp3',
    '/media/טריגרים/זיקוקים/Explosive_crackling___2-1779986072385.mp3',
    '/media/טריגרים/זיקוקים/fireworks__3-1779986069775.mp3',
    '/media/טריגרים/זיקוקים/A_series_of_sharp,_e__4-1779986076708.mp3',
  ],
  dog: [
    '/media/טריגרים/כלב/A_sudden_and_aggress__1-1779986032540.mp3',
    '/media/טריגרים/כלב/A_sudden_and_aggress__2-1779986032517.mp3',
    '/media/טריגרים/כלב/A_sudden_and_aggress__4-1779986032158.mp3',
  ],
  helicopter: [
    '/media/טריגרים/מסוק/A_realistic,_low-fre__2-1779986081135.mp3',
    '/media/טריגרים/מסוק/A_realistic,_low-fre__3-1779986085527.mp3',
  ],
  restaurant: [
    '/media/טריגרים/מסעדה/A_chaotic,_realistic__1-1779986094670.mp3',
    '/media/טריגרים/מסעדה/A_chaotic,_realistic__2-1779986097088.mp3',
    '/media/טריגרים/מסעדה/A_chaotic,_realistic__3-1779986097469.mp3',
    '/media/טריגרים/מסעדה/A_chaotic,_realistic__4-1779986097553.mp3',
    '/media/טריגרים/מסעדה/A_chaotic,_realistic__4-1779986097553 (1).mp3',
  ],
  siren: [
    '/media/טריגרים/סירנה/A_piercing,_wailing___1-1779986032093.mp3',
    '/media/טריגרים/סירנה/A_piercing,_wailing___2-1779986054706.mp3',
    '/media/טריגרים/סירנה/A_piercing,_wailing___4-1779986055068.mp3',
  ],
  horn: [
    '/media/טריגרים/צפירת מכונית/A_realistic,_loud,_a__1-1779986032109.mp3',
    '/media/טריגרים/צפירת מכונית/A_realistic,_loud,_a__2-1779986032092.mp3',
  ],
  baby: [
    '/media/טריגרים/תינוק בוכה/A_realistic,_high-st__1-1779986032142.mp3',
    '/media/טריגרים/תינוק בוכה/A_realistic,_high-st__2-1779986032126.mp3',
    '/media/טריגרים/תינוק בוכה/A_realistic,_high-st__3-1779986032109.mp3',
  ],
};

// Note: Environment-based trigger selection was removed. Triggers are now user-selected via selectedTrigger.
export class AudioEngine {
  private ctx: AudioContext | null = null;
  
  // Gain nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private voiceoverGain: GainNode | null = null;
  private triggerGain: GainNode | null = null;
  
  // Filter nodes
  private noiseFilter: BiquadFilterNode | null = null;
  private triggerFilter: BiquadFilterNode | null = null;
  
  // Preloaded buffers
  private loadedMusicBuffer: AudioBuffer | null = null;
  private loadedMusicNorm: number = 1;
  private loadedNoiseBuffer: AudioBuffer | null = null;
  private loadedNoiseNorm: number = 1;
  private loadedVoiceoverOpening: AudioBuffer | null = null;
  private loadedVoiceoverMiddle: AudioBuffer | null = null;
  private loadedVoiceoverClosing: AudioBuffer | null = null;
  private loadedTriggerBuffers: { name: string; buffer: AudioBuffer; norm: number }[] = [];
  
  // Active source nodes
  private musicSource: AudioBufferSourceNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private voiceoverSource: AudioBufferSourceNode | null = null;
  private activeTriggerSources: AudioBufferSourceNode[] = [];
  

  
  // Spikes scheduler state
  private exposureStartSeconds: number | null = null;
  private exposureEndSeconds: number | null = null;
  private scheduledSpikeSeconds: number[] = [];
  private triggeredSpikeSeconds: Set<number> = new Set();
  
  // State
  public currentPhase: SessionPhase = 'opening';
  public onPhaseChange: ((phase: SessionPhase) => void) | null = null;
  public onFallbackTriggered: ((msg: string) => void) | null = null;
  
  private settings: AudioEngineSettings = {
    musicEnabled: true,
    musicVolume: 0.5,
    noiseVolume: 0.2,
    muffleLevel: 0.5,
    spikeFrequency: 0.3,
    spikeCount: 4,
    exposureType: 'cafe',
    voiceoverLanguage: 'he',
    noiseVariantIndex: -1,
    selectedTrigger: 'doorSlam',
    triggerVolume: 0.5,
    triggerMuffleLevel: 0.3,
  };

  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  constructor(onFallback?: (msg: string) => void) {
    if (onFallback) {
      this.onFallbackTriggered = onFallback;
    }
  }

  // Initialize the audio context and routing graph
  public init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master routing
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    
    // Music channel
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(this.settings.musicVolume, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);
    
    // Noise channel (with lowpass filter)
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.updateMuffleFilter();
    
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start muted, controlled by phase machine
    
    this.noiseGain.connect(this.noiseFilter);
    this.noiseFilter.connect(this.masterGain);

    // Trigger channel (independent gain + lowpass filter)
    this.triggerFilter = this.ctx.createBiquadFilter();
    this.triggerFilter.type = 'lowpass';
    this.updateTriggerMuffleFilter();

    this.triggerGain = this.ctx.createGain();
    this.triggerGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start muted, controlled by phase machine

    this.triggerGain.connect(this.triggerFilter);
    this.triggerFilter.connect(this.masterGain);

    // Voiceover guidance channel (bypasses noise filter, plays straight to master)
    this.voiceoverGain = this.ctx.createGain();
    this.voiceoverGain.gain.setValueAtTime(0.9, this.ctx.currentTime); // Keep guidance clear and loud
    this.voiceoverGain.connect(this.masterGain);
  }

  // Calculate peak-normalization gain factor so all buffers play at a consistent reference level
  private getBufferNormFactor(buffer: AudioBuffer, target = 0.85): number {
    let peak = 0;
    for (let c = 0; c < buffer.numberOfChannels; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i]);
        if (abs > peak) peak = abs;
      }
    }
    if (peak === 0) return 1;
    return Math.min(target / peak, 4); // cap at 4x to avoid over-amplifying near-silent files
  }

  // Helper to load and decode a single audio file
  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.ctx) return null;
    try {
      // Encode URL segments properly to handle '#' and spaces or Hebrew characters
      const encodedUrl = url.split('/').map(segment => encodeURIComponent(segment)).join('/');
      const response = await fetch(encodedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error(`Failed to load audio from ${url}:`, e);
      return null;
    }
  }

  // Preload all assets required for the session to prevent lag
  public async preload(settings: AudioEngineSettings): Promise<boolean> {
    this.settings = { ...this.settings, ...settings };
    this.init();
    
    if (!this.ctx) return false;
    
    if (this.onFallbackTriggered) {
      this.onFallbackTriggered('Loading media files...');
    }

    try {
      // 1. Load constant Wellness Music (same for all environments) if enabled
      if (this.settings.musicEnabled) {
        const musicUrl = MUSIC_FILES.default;
        this.loadedMusicBuffer = await this.loadAudioBuffer(musicUrl);
        this.loadedMusicNorm = this.loadedMusicBuffer ? this.getBufferNormFactor(this.loadedMusicBuffer) : 1;
      } else {
        this.loadedMusicBuffer = null;
        this.loadedMusicNorm = 1;
      }

      // 2. Select and load Background Noise (specific variant or random)
      const noiseOptions = BACKGROUND_NOISES[this.settings.exposureType] || BACKGROUND_NOISES.cafe;
      const variantIdx = this.settings.noiseVariantIndex >= 0
        ? Math.min(this.settings.noiseVariantIndex, noiseOptions.length - 1)
        : Math.floor(Math.random() * noiseOptions.length);
      this.loadedNoiseBuffer = await this.loadAudioBuffer(noiseOptions[variantIdx]);
      this.loadedNoiseNorm = this.loadedNoiseBuffer ? this.getBufferNormFactor(this.loadedNoiseBuffer) : 1;
      
      // 3. Load Voiceover Tracks
      const lang = this.settings.voiceoverLanguage || 'he';
      const voSet = VOICEOVERS[lang][this.settings.exposureType];
      
      this.loadedVoiceoverOpening = await this.loadAudioBuffer(voSet.opening);
      this.loadedVoiceoverMiddle = await this.loadAudioBuffer(voSet.middle);
      this.loadedVoiceoverClosing = await this.loadAudioBuffer(voSet.closing);

      // 4. Load all variants for the user-selected trigger type
      this.loadedTriggerBuffers = [];
      if (this.settings.selectedTrigger !== 'none') {
        const selectedKey = this.settings.selectedTrigger as keyof typeof TRIGGERS;
        const pool = TRIGGERS[selectedKey];
        if (pool && pool.length > 0) {
          for (const url of pool) {
            const buffer = await this.loadAudioBuffer(url);
            if (buffer) {
              this.loadedTriggerBuffers.push({ name: selectedKey, buffer, norm: this.getBufferNormFactor(buffer) });
            }
          }
        }
      }

      if (this.onFallbackTriggered) {
        this.onFallbackTriggered('Media preloaded successfully');
      }
      return true;
    } catch (err) {
      console.error('Error preloading audio files, playing synthesized fallbacks', err);
      if (this.onFallbackTriggered) {
        this.onFallbackTriggered('Loading error. Activating synthesized backup audio.');
      }
      return false;
    }
  }

  // Start the session playback
  public async start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;

    // Start wellness music looping (only if enabled)
    if (this.settings.musicEnabled && this.loadedMusicBuffer) {
      this.musicSource = this.ctx.createBufferSource();
      this.musicSource.buffer = this.loadedMusicBuffer;
      this.musicSource.loop = true;
      const musicNormGain = this.ctx.createGain();
      musicNormGain.gain.value = this.loadedMusicNorm;
      this.musicSource.connect(musicNormGain);
      musicNormGain.connect(this.musicGain!);
      this.musicSource.start(0);
    } else if (this.settings.musicEnabled && !this.loadedMusicBuffer) {
      // Fallback synthesis if preload failed but music is enabled
      this.startWellnessMusicSynthFallback();
    }

    // Begin the voiceover phase machine at Stage 1: Opening
    this.transitionToPhase('opening');
  }

  // Handle phase changes and adjust audio routing dynamically
  private transitionToPhase(phase: SessionPhase) {
    if (!this.ctx || !this.isPlaying) return;
    
    this.currentPhase = phase;
    if (this.onPhaseChange) {
      this.onPhaseChange(phase);
    }

    const now = this.ctx.currentTime;

    // Stop any currently running voiceover source node
    if (this.voiceoverSource) {
      try {
        this.voiceoverSource.onended = null;
        this.voiceoverSource.stop();
      } catch (e) {}
      this.voiceoverSource = null;
    }

    // Reset scheduling states on any transition
    this.exposureStartSeconds = null;
    this.exposureEndSeconds = null;
    this.scheduledSpikeSeconds = [];
    this.triggeredSpikeSeconds.clear();

    switch (phase) {
      case 'opening': {
        // Stage 1: Play opening voiceover. Keep background noise muted.
        if (this.loadedVoiceoverOpening) {
          this.voiceoverSource = this.ctx.createBufferSource();
          this.voiceoverSource.buffer = this.loadedVoiceoverOpening;
          this.voiceoverSource.connect(this.voiceoverGain!);
          
          this.voiceoverSource.onended = () => {
            this.transitionToPhase('briefing');
          };
          this.voiceoverSource.start(0);
        } else {
          // If no buffer, transition after a short procedural wait
          window.setTimeout(() => this.transitionToPhase('briefing'), 10000);
        }
        break;
      }
      
      case 'briefing': {
        // Stage 2: Play middle briefing voiceover. Start background noise at a very soft, safe 5% level.
        if (this.noiseGain) {
          this.noiseGain.gain.cancelScheduledValues(now);
          this.noiseGain.gain.setValueAtTime(0, now);
          this.noiseGain.gain.linearRampToValueAtTime(0.05, now + 2.0);
        }

        // Start playing the background loop
        if (this.loadedNoiseBuffer && !this.noiseSource) {
          this.noiseSource = this.ctx.createBufferSource();
          this.noiseSource.buffer = this.loadedNoiseBuffer;
          this.noiseSource.loop = true;
          const noiseNormGain = this.ctx.createGain();
          noiseNormGain.gain.value = this.loadedNoiseNorm;
          this.noiseSource.connect(noiseNormGain);
          noiseNormGain.connect(this.noiseGain!);
          this.noiseSource.start(0);
        }

        if (this.loadedVoiceoverMiddle) {
          this.voiceoverSource = this.ctx.createBufferSource();
          this.voiceoverSource.buffer = this.loadedVoiceoverMiddle;
          this.voiceoverSource.connect(this.voiceoverGain!);
          
          this.voiceoverSource.onended = () => {
            this.transitionToPhase('exposure');
          };
          this.voiceoverSource.start(0);
        } else {
          window.setTimeout(() => this.transitionToPhase('exposure'), 15000);
        }
        break;
      }
      
      case 'exposure': {
        // Stage 3: Active Exposure. Ramp background noise to target level. Enable triggers.
        if (this.noiseGain) {
          this.noiseGain.gain.cancelScheduledValues(now);
          this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
          this.noiseGain.gain.linearRampToValueAtTime(this.settings.noiseVolume, now + 5.0);
        }

        // Ramp trigger gain to target level for exposure phase
        if (this.triggerGain) {
          this.triggerGain.gain.cancelScheduledValues(now);
          this.triggerGain.gain.setValueAtTime(0, now);
          this.triggerGain.gain.linearRampToValueAtTime(this.settings.triggerVolume, now + 5.0);
        }

        // Ensure background loop is playing
        if (this.loadedNoiseBuffer && !this.noiseSource) {
          this.noiseSource = this.ctx.createBufferSource();
          this.noiseSource.buffer = this.loadedNoiseBuffer;
          this.noiseSource.loop = true;
          const noiseNormGain = this.ctx.createGain();
          noiseNormGain.gain.value = this.loadedNoiseNorm;
          this.noiseSource.connect(noiseNormGain);
          noiseNormGain.connect(this.noiseGain!);
          this.noiseSource.start(0);
        }
        break;
      }

      case 'closing': {
        // Stage 4: Calming/Closing. Ramp background noise and triggers to 0. Play closing voiceover.
        if (this.noiseGain) {
          this.noiseGain.gain.cancelScheduledValues(now);
          this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
          this.noiseGain.gain.linearRampToValueAtTime(0, now + 3.0);
        }

        if (this.triggerGain) {
          this.triggerGain.gain.cancelScheduledValues(now);
          this.triggerGain.gain.setValueAtTime(this.triggerGain.gain.value, now);
          this.triggerGain.gain.linearRampToValueAtTime(0, now + 3.0);
        }

        if (this.loadedVoiceoverClosing) {
          this.voiceoverSource = this.ctx.createBufferSource();
          this.voiceoverSource.buffer = this.loadedVoiceoverClosing;
          this.voiceoverSource.connect(this.voiceoverGain!);
          this.voiceoverSource.start(0);
        }
        break;
      }
    }
  }

  // Periodic tick updater sent from React's countdown timer
  public tick(timeLeftSeconds: number) {
    if (!this.isPlaying || this.isPaused || !this.ctx) return;

    if (this.currentPhase === 'exposure') {
      const closingDuration = this.loadedVoiceoverClosing ? this.loadedVoiceoverClosing.duration : 30;
      
      // Trigger closing phase when remaining time is less than/equal to the closing voiceover length + 2s padding
      if (timeLeftSeconds <= closingDuration + 2) {
        this.transitionToPhase('closing');
        return;
      }

      // Initialize spike schedule if not yet set
      if (this.exposureStartSeconds === null) {
        this.exposureStartSeconds = timeLeftSeconds;
        this.exposureEndSeconds = Math.ceil(closingDuration + 2);
        
        const exposureDuration = this.exposureStartSeconds - this.exposureEndSeconds;
        const count = this.settings.spikeCount;
        
        this.scheduledSpikeSeconds = [];
        this.triggeredSpikeSeconds.clear();
        
        if (count > 0 && exposureDuration > 10) {
          // Divide the duration into count + 1 segments
          const segmentLength = exposureDuration / (count + 1);
          for (let i = 1; i <= count; i++) {
            const targetSecond = Math.round(this.exposureStartSeconds - i * segmentLength);
            this.scheduledSpikeSeconds.push(targetSecond);
          }
          console.log(`Scheduled ${count} spikes at remaining seconds:`, this.scheduledSpikeSeconds);
        }
      }

      // Check if we hit any scheduled spike second
      for (const targetSecond of this.scheduledSpikeSeconds) {
        if (timeLeftSeconds <= targetSecond && !this.triggeredSpikeSeconds.has(targetSecond)) {
          this.triggeredSpikeSeconds.add(targetSecond);
          this.triggerSuddenSpike();
        }
      }
    }
  }

  private clearSpikeTriggers() {
    // Keep for backward compatibility, reset scheduled state
    this.exposureStartSeconds = null;
    this.exposureEndSeconds = null;
    this.scheduledSpikeSeconds = [];
    this.triggeredSpikeSeconds.clear();
  }

  // Play a random preloaded trigger sound through the independent trigger channel
  private triggerSuddenSpike() {
    if (!this.ctx || !this.triggerGain || this.loadedTriggerBuffers.length === 0) return;
    
    const now = this.ctx.currentTime;
    const item = this.loadedTriggerBuffers[Math.floor(Math.random() * this.loadedTriggerBuffers.length)];
    
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = item.buffer;

      const trigNormGain = this.ctx.createGain();
      trigNormGain.gain.value = item.norm;
      source.connect(trigNormGain);
      // Connect to triggerGain (independent channel with its own volume + filter)
      trigNormGain.connect(this.triggerGain);
      source.start(now);
      
      this.activeTriggerSources.push(source);
      source.onended = () => {
        this.activeTriggerSources = this.activeTriggerSources.filter(s => s !== source);
      };
    } catch (e) {
      console.error('Failed to trigger spike sound:', e);
    }
  }

  // Pause the entire audio engine
  public pause() {
    if (!this.isPlaying || this.isPaused || !this.ctx) return;
    this.ctx.suspend();
    this.isPaused = true;
  }

  // Resume playing after pause
  public resume() {
    if (!this.isPlaying || !this.isPaused || !this.ctx) return;
    this.ctx.resume();
    this.isPaused = false;
  }

  // Stop all playback channels and reset nodes
  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    
    this.clearSpikeTriggers();

    if (this.musicSource) {
      try { this.musicSource.stop(); } catch (e) {}
      this.musicSource = null;
    }

    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch (e) {}
      this.noiseSource = null;
    }

    if (this.voiceoverSource) {
      try { this.voiceoverSource.stop(); } catch (e) {}
      this.voiceoverSource = null;
    }

    this.activeTriggerSources.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    this.activeTriggerSources = [];

    // Stop synthetic fallbacks if running
    this.stopWellnessMusicSynthFallback();
  }

  // Emergency SOS: immediate fade-out of exposure noises and triggers, music drops to 15%
  public triggerSOS() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    this.clearSpikeTriggers();
    
    if (this.noiseGain) {
      this.noiseGain.gain.cancelScheduledValues(now);
      this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
      this.noiseGain.gain.linearRampToValueAtTime(0, now + 1.0);
    }

    if (this.triggerGain) {
      this.triggerGain.gain.cancelScheduledValues(now);
      this.triggerGain.gain.setValueAtTime(this.triggerGain.gain.value, now);
      this.triggerGain.gain.linearRampToValueAtTime(0, now + 1.0);
    }

    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.15, now + 1.5);
    }

    if (this.voiceoverSource) {
      try { this.voiceoverSource.stop(); } catch (e) {}
      this.voiceoverSource = null;
    }
  }

  // Resume normal levels after SOS is cleared
  public clearSOS() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    if (this.noiseGain && this.currentPhase === 'exposure') {
      this.noiseGain.gain.cancelScheduledValues(now);
      this.noiseGain.gain.setValueAtTime(0, now);
      this.noiseGain.gain.linearRampToValueAtTime(this.settings.noiseVolume, now + 2.0);
    }

    if (this.triggerGain && this.currentPhase === 'exposure') {
      this.triggerGain.gain.cancelScheduledValues(now);
      this.triggerGain.gain.setValueAtTime(0, now);
      this.triggerGain.gain.linearRampToValueAtTime(this.settings.triggerVolume, now + 2.0);
    }

    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(this.settings.musicVolume, now + 2.0);
    }
  }

  // Live settings adjustments
  public updateSettings(newSettings: Partial<AudioEngineSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (newSettings.musicVolume !== undefined && this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(this.settings.musicVolume, now + 0.5);
    }

    if (newSettings.noiseVolume !== undefined && this.noiseGain) {
      if (this.currentPhase === 'exposure') {
        this.noiseGain.gain.cancelScheduledValues(now);
        this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
        this.noiseGain.gain.linearRampToValueAtTime(this.settings.noiseVolume, now + 0.5);
      } else if (this.currentPhase === 'briefing') {
        this.noiseGain.gain.cancelScheduledValues(now);
        this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
        this.noiseGain.gain.linearRampToValueAtTime(Math.min(0.05, this.settings.noiseVolume), now + 0.5);
      }
    }

    if (newSettings.triggerVolume !== undefined && this.triggerGain) {
      if (this.currentPhase === 'exposure') {
        this.triggerGain.gain.cancelScheduledValues(now);
        this.triggerGain.gain.setValueAtTime(this.triggerGain.gain.value, now);
        this.triggerGain.gain.linearRampToValueAtTime(this.settings.triggerVolume, now + 0.5);
      }
    }

    if (newSettings.muffleLevel !== undefined) {
      this.updateMuffleFilter();
    }

    if (newSettings.triggerMuffleLevel !== undefined) {
      this.updateTriggerMuffleFilter();
    }
  }

  // Muffle filter Low-pass adjuster for background noise
  private updateMuffleFilter() {
    if (!this.noiseFilter || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    const minHz = 200;
    const maxHz = 16000;
    const exponent = 1 - this.settings.muffleLevel;
    const targetHz = minHz + (maxHz - minHz) * Math.pow(exponent, 3);
    
    this.noiseFilter.frequency.cancelScheduledValues(now);
    this.noiseFilter.frequency.exponentialRampToValueAtTime(Math.max(20, targetHz), now + 0.5);
  }

  // Muffle filter Low-pass adjuster for triggers (independent from noise)
  private updateTriggerMuffleFilter() {
    if (!this.triggerFilter || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    const minHz = 200;
    const maxHz = 16000;
    const exponent = 1 - this.settings.triggerMuffleLevel;
    const targetHz = minHz + (maxHz - minHz) * Math.pow(exponent, 3);
    
    this.triggerFilter.frequency.cancelScheduledValues(now);
    this.triggerFilter.frequency.exponentialRampToValueAtTime(Math.max(20, targetHz), now + 0.5);
  }

  // SYNTHESIS FALLBACKS (If preloading fails, e.g. server offline)
  private musicOscillators: OscillatorNode[] = [];
  private musicGainNodes: GainNode[] = [];
  private syntheticIntervals: number[] = [];

  private startWellnessMusicSynthFallback() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const baseFreqs = [130.81, 196.00, 261.63, 329.63, 392.00];

    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

      const baseGain = 0.05 + (0.03 * (baseFreqs.length - idx) / baseFreqs.length);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseGain, now + 3.0 + idx * 0.5);

      osc.connect(gain);
      gain.connect(this.musicGain!);
      
      osc.start(now);
      this.musicOscillators.push(osc);
      this.musicGainNodes.push(gain);

      this.modulateGainSynthFallback(gain, baseGain, idx);
    });
  }

  private modulateGainSynthFallback(gainNode: GainNode, targetGain: number, index: number) {
    if (!this.ctx) return;
    const period = 8000 + index * 3000;
    const interval = window.setInterval(() => {
      if (!this.isPlaying || this.isPaused || !this.ctx) return;
      const now = this.ctx.currentTime;
      const nextGain = targetGain * (0.4 + 0.6 * Math.random());
      
      try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(nextGain, now + (period / 2000));
      } catch(e) {}
    }, period / 2);

    this.syntheticIntervals.push(interval);
  }

  private stopWellnessMusicSynthFallback() {
    this.musicOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.musicOscillators = [];
    this.musicGainNodes = [];
    this.syntheticIntervals.forEach(clearInterval);
    this.syntheticIntervals = [];
  }
}
