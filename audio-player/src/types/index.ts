export interface AudioFile {
    id: string;
    title: string;
    artist: string;
    duration: number; // duration in seconds
    source: string; // URL or path to the MP3 file
}