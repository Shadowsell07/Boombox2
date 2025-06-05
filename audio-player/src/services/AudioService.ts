// src/services/AudioService.ts

export class AudioService {
  private audio: HTMLAudioElement;
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.audio = new Audio();
    this.setupAudioContext();
  }

  private setupAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioContext) {
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaElementSource(this.audio);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    }
  }

  async loadTrack(url: string) {
    this.audio.src = url;
    await this.audio.load();
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  setVolume(level: number) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  getAnalyserData() {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}