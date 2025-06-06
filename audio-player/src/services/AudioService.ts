// src/services/AudioService.ts

export class AudioService {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.addEventListener('canplay', () => console.log('Audio can play'));
    this.audio.addEventListener('error', (e) => console.error('Audio error:', e));
  }

  setupAnalyser() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 32;
        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.connect(this.analyser);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        console.log('Audio analyzer setup complete');
      } catch (error) {
        console.error('Failed to setup analyzer:', error);
      }
    }
  }

  async play() {
    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      await this.audio.play();
      console.log('Playback started');
    } catch (error) {
      console.error('Play failed:', error);
      throw error;
    }
  }

  async loadTrack(url: string) {
    console.log('Loading track:', url);
    this.audio.src = url;
    await this.audio.load();
  }

  pause() {
    this.audio.pause();
  }

  setVolume(level: number) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  getAudioData() {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return null;
  }
}