// Web Audio API Sound Synthesizer for alerts, sirens, and interactive feedback

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isSirenPlaying = false;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenInterval = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  toggleEmergencySiren(startCallback, stopCallback) {
    if (this.isSirenPlaying) {
      this.stopEmergencySiren();
      if (stopCallback) stopCallback();
      return false;
    } else {
      this.startEmergencySiren();
      if (startCallback) startCallback();
      return true;
    }
  }

  startEmergencySiren() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      this.isSirenPlaying = true;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.18, now);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);

      let high = true;
      const sweep = () => {
        if (!this.isSirenPlaying) return;
        const t = this.ctx.currentTime;
        if (high) {
          osc.frequency.exponentialRampToValueAtTime(960, t + 0.4);
        } else {
          osc.frequency.exponentialRampToValueAtTime(480, t + 0.4);
        }
        high = !high;
      };

      sweep();
      this.sirenInterval = setInterval(sweep, 450);

      this.sirenOsc = osc;
      this.sirenGain = gain;
    } catch (e) {
      console.warn("Siren start error", e);
    }
  }

  stopEmergencySiren() {
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenGain && this.ctx) {
      try {
        this.sirenGain.gain.setValueAtTime(this.sirenGain.gain.value, this.ctx.currentTime);
        this.sirenGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          if (this.sirenOsc) {
            try { this.sirenOsc.stop(); } catch(e){}
            this.sirenOsc = null;
          }
        }, 120);
      } catch (e) {}
    }
  }
}

export const soundManager = new SoundEffects();
