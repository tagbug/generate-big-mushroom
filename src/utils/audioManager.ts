class AudioManager {
  private enabled = true;
  private volume = 0.5;
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  constructor() {
    // 只在客户端环境中初始化
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private initializeAudio() {
    if (this.isInitialized) return;
    
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isInitialized = true;
      }
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.enabled || typeof window === 'undefined') return;
    
    this.ensureInitialized();
    if (!this.audioContext) return;

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
    if (!this.enabled || typeof window === 'undefined') return;
    
    this.ensureInitialized();
    if (!this.audioContext) return;

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration, volume);
      }, index * 50);
    });
  }

  public play(soundName: string) {
    if (!this.enabled || typeof window === 'undefined') return;

    this.ensureInitialized();

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
      case 'newRecord':
        // 播放胜利音效
        this.playChord([523, 659, 784, 1047], 0.5, 0.2);
        setTimeout(() => this.playChord([659, 784, 1047, 1319], 0.3, 0.15), 200);
        break;
      case 'mania':
        // 播放Mania模式音效
        this.playChord([440, 554, 659], 0.2, 0.25);
        setTimeout(() => this.playChord([554, 659, 880], 0.2, 0.2), 150);
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

  public playNewRecord() {
    this.play('newRecord');
  }

  public playGameOver() {
    this.play('gameOver');
  }

  public playClick() {
    this.play('click');
  }

  public playDrop() {
    this.play('drop');
  }

  public playMerge() {
    this.play('merge');
  }

  public playComboMerge(comboCount: number) {
    if (!this.enabled || typeof window === 'undefined') return;

    this.ensureInitialized();

    // 确保音频上下文已启动
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // 根据combo数量调整音效
    const baseFrequencies = [523, 659, 784];
    const pitchMultiplier = 1 + Math.min(Math.floor(comboCount / 3) * 0.1, 0.5); // 最高提升0.5倍音调
    const frequencies = baseFrequencies.map(f => f * pitchMultiplier);
    
    // 持续时间随combo减少，变得更急促
    const baseDuration = 0.3;
    const duration = Math.max(baseDuration - comboCount * 0.01, 0.15);
    
    // 音量随combo增加
    const baseVolume = 0.2;
    const volume = Math.min(baseVolume + comboCount * 0.05, 0.5);
    
    this.playChord(frequencies, duration, volume);
  }

  public playMania() {
    this.play('mania');
  }
}

export const audioManager = new AudioManager();
