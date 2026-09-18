/**
 * Generates an ambient soundscape using Web Audio API
 * Emulating gentle meditation tones (Weightless-inspired soothing ambient frequency)
 */

class CalmingSoundscapeManager {
  private audioCtx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      // Fade in smoothly over 3 seconds
      this.gainNode.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 3);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      this.gainNode.connect(filter);
      filter.connect(this.audioCtx.destination);

      // Relaxing pentatonic chord notes (C3, G3, A3, E4)
      const frequencies = [130.81, 196.0, 220.0, 329.63];

      this.oscillators = frequencies.map((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

        // Add subtle detune for warm, rich chorus effect
        osc.detune.setValueAtTime((idx - 1.5) * 4, this.audioCtx!.currentTime);

        const oscGain = this.audioCtx!.createGain();
        oscGain.gain.setValueAtTime(0.25, this.audioCtx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.gainNode!);

        osc.start();
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      console.warn('Web Audio playback failed or blocked by autoplay:', e);
    }
  }

  public stop() {
    if (!this.isPlaying || !this.audioCtx || !this.gainNode) return;

    try {
      // Fade out smoothly over 1.5s
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.oscillators = [];
        if (this.audioCtx) {
          this.audioCtx.close();
          this.audioCtx = null;
        }
        this.isPlaying = false;
      }, 1600);
    } catch {
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const soundscapePlayer = new CalmingSoundscapeManager();
