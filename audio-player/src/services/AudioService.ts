// src/services/AudioService.ts

export class AudioService {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.audio = new Audio();
    // Add debug listeners
    this.audio.addEventListener('loadstart', () => console.log('Loading audio...'));
    this.audio.addEventListener('canplay', () => console.log('Audio can play'));
    this.audio.addEventListener('error', (e) => console.error('Audio error:', e));
  }

  async loadTrack(url: string) {
    console.log('Loading track:', url);
    this.audio.src = url;
    await this.audio.load();
  }

  async play() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = this.audioContext.createMediaElementSource(this.audio);
        source.connect(this.audioContext.destination);
      }
      await this.audio.play();
    } catch (error) {
      console.error('Play failed:', error);
      throw error;
    }
  }

  pause() {
    this.audio.pause();
  }

  setVolume(level: number) {
    console.log('Setting volume to:', level);
    this.audio.volume = level;
  }
}