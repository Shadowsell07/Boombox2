// src/services/AudioService.ts

export class AudioService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  loadTrack(url: string) {
    this.audio.src = url;
    return this.audio.load();
  }

  play() {
    return this.audio.play();
  }

  pause() {
    return this.audio.pause();
  }

  setVolume(level: number) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }
}