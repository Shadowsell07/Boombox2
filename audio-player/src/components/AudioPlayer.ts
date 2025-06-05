export class AudioPlayer {
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio();
    }

    public load(source: string): void {
        this.audio.src = source;
    }

    public play(): void {
        this.audio.play();
    }

    public pause(): void {
        this.audio.pause();
    }

    public stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    public getCurrentTime(): number {
        return this.audio.currentTime;
    }
}