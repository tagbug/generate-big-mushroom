class AudioManager {
  private enabled = true;
  private volume = 0.5;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing tone', error);
    }
  }

  private playChord(frequencies: number[], duration: number, volume: number = 0.2) {
    if (!this.enabled || !this.audioContext) return;

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration, volume);
      }, index * 50);
    });
  }

  public play(soundName: string) {
    if (!this.enabled) return;

    // 确保音频上下文已启动
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (soundName) {
      case 'drop':
        this.playTone(440, 0.1, 0.2);
        break;
      case 'merge':
        this.playChord([523, 659, 784], 0.3, 0.15);
        break;
      case 'gameOver':
        this.playChord([330, 277, 220], 0.8, 0.1);
        break;
      case 'click':
        this.playTone(880, 0.05, 0.1);
        break;
      default:
        console.warn(`Unknown sound: ${soundName}`);
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const audioManager = new AudioManager();
