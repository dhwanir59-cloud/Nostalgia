/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class NostalgiaSynth {
  private ctx: AudioContext | null = null;
  private oscillators: { [key: string]: OscillatorNode } = {};
  private gains: { [key: string]: GainNode } = {};

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("AudioContext not supported on this browser.");
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors from browser autoplay block
    }
  }

  playDialup(onProgress: (percent: number) => void, onComplete: () => void) {
    this.init();
    if (!this.ctx) {
      onComplete();
      return;
    }
    try {
      const now = this.ctx.currentTime;
      // Sequence of static and handshake frequencies
      const tones = [350, 440, 1000, 300, 1200, 600, 2000, 100, 800, 1500];
      tones.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, idx % 2 === 0 ? "sawtooth" : "sine", 0.3, 0.03);
          onProgress(Math.min(((idx + 1) / tones.length) * 100, 100));
        }, idx * 300);
      });

      setTimeout(() => {
        onComplete();
      }, tones.length * 300);
    } catch (e) {
      onComplete();
    }
  }

  playGameSound(type: 'coin' | 'hit' | 'nudge' | 'stamp' | 'match') {
    this.init();
    if (!this.ctx) return;
    try {
      if (type === 'coin') {
        this.playTone(523.25, 'sine', 0.1, 0.08); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.08), 80); // E5
      } else if (type === 'hit') {
        this.playTone(180, 'triangle', 0.15, 0.15);
      } else if (type === 'nudge') {
        this.playTone(90, 'sawtooth', 0.4, 0.2);
        this.playTone(95, 'sawtooth', 0.4, 0.2);
      } else if (type === 'stamp') {
        this.playTone(220, 'triangle', 0.1, 0.12);
        setTimeout(() => this.playTone(110, 'sine', 0.2, 0.1), 50);
      } else if (type === 'match') {
        this.playTone(392, 'sine', 0.08, 0.1); // G4
        setTimeout(() => this.playTone(523.25, 'sine', 0.08, 0.1), 60); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 120); // E5
      }
    } catch (e) {
      // Autoplay block safety
    }
  }

  // Synthesize loopable sounds
  startContinuousSound(id: string, type: 'rain' | 'static' | 'cricket' | 'keyboard' | 'school') {
    this.init();
    if (!this.ctx) return null;
    try {
      this.stopContinuousSound(id);

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);

      if (type === 'rain') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(70, this.ctx.currentTime);
        // Add random modulations using a second low frequency oscillator
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        mod.frequency.setValueAtTime(4, this.ctx.currentTime);
        modGain.gain.setValueAtTime(20, this.ctx.currentTime);
        mod.connect(modGain);
        modGain.connect(osc.frequency);
        mod.start();
        (this.oscillators as any)[id + '_mod'] = mod;
      } else if (type === 'static') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      } else if (type === 'cricket') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3500, this.ctx.currentTime);
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        mod.frequency.setValueAtTime(8, this.ctx.currentTime); // chirping rate
        modGain.gain.setValueAtTime(1, this.ctx.currentTime);
        mod.connect(modGain);
        modGain.connect(gainNode.gain);
        mod.start();
        (this.oscillators as any)[id + '_mod'] = mod;
      } else if (type === 'keyboard') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        mod.frequency.setValueAtTime(1.5, this.ctx.currentTime);
        modGain.gain.setValueAtTime(1, this.ctx.currentTime);
        mod.connect(modGain);
        modGain.connect(gainNode.gain);
        mod.start();
        (this.oscillators as any)[id + '_mod'] = mod;
      } else if (type === 'school') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      }

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();

      this.oscillators[id] = osc;
      this.gains[id] = gainNode;
    } catch (e) {
      console.warn("Could not start ambient synthesizer channel:", e);
    }
  }

  setVolume(id: string, volume: number) {
    if (!this.ctx) return;
    const gainNode = this.gains[id];
    if (gainNode) {
      gainNode.gain.setValueAtTime(volume * 0.04, this.ctx.currentTime);
    }
  }

  stopContinuousSound(id: string) {
    try {
      const osc = this.oscillators[id];
      if (osc) {
        osc.stop();
        delete this.oscillators[id];
      }
      const gain = this.gains[id];
      if (gain) {
        gain.disconnect();
        delete this.gains[id];
      }
      const mod = (this.oscillators as any)[id + '_mod'];
      if (mod) {
        mod.stop();
        delete (this.oscillators as any)[id + '_mod'];
      }
    } catch (e) {
      // Ignored
    }
  }

  stopAll() {
    Object.keys(this.oscillators).forEach(id => this.stopContinuousSound(id));
  }
}

export const synth = new NostalgiaSynth();
