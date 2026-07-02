// Web Audio API Synthesizer for child-friendly sound effects.
// This requires no external files and compiles cleanly anywhere!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction to satisfy browser security
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.warn("SoundEngine click error:", e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Play a lovely major third arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn("SoundEngine success error:", e);
    }
  }

  playMistake() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft cartoon "boing" slide down
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      // Simple lowpass filter to make it warmer/less buzz
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      
      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn("SoundEngine mistake error:", e);
    }
  }

  playHint() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Sparkling chime sound
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        // ascending shiny pentatonic notes
        const freq = 1200 + i * 150 + Math.random() * 50;
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.25);
      }
    } catch (e) {
      console.warn("SoundEngine hint error:", e);
    }
  }

  playVictory() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Grand retro arpeggio arpeggiating up then holding a chord
      const chords = [
        [523.25, 120], // C5
        [659.25, 120], // E5
        [783.99, 120], // G5
        [1046.50, 120], // C6
        [1318.51, 240], // E6
      ];

      chords.forEach(([freq], idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + (idx === chords.length - 1 ? 0.8 : 0.4));

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.9);
      });
    } catch (e) {
      console.warn("SoundEngine victory error:", e);
    }
  }
}

export const sound = new SoundEngine();
