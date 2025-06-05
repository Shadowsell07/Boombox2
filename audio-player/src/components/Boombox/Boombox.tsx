import React, { useState, useEffect, useRef } from 'react';
import { AudioService } from '../../services/AudioService';
import './Boombox.css';

interface BoomboxProps {
  audioFiles: {
    title: string;
    url: string;
  }[];
}

export const Boombox: React.FC<BoomboxProps> = ({ audioFiles }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioService = useRef(new AudioService());
  const animationFrame = useRef<number | undefined>(undefined);

  useEffect(() => {
    audioService.current.loadTrack(audioFiles[currentTrack].url);
    audioService.current.setVolume(volume);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioService.current.pause();
    } else {
      await audioService.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevTrack = () => {
    setCurrentTrack(prev => (prev > 0 ? prev - 1 : audioFiles.length - 1));
  };

  const handleNextTrack = () => {
    setCurrentTrack(prev => (prev < audioFiles.length - 1 ? prev + 1 : 0));
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioService.current.setVolume(newVolume);
  };

  return (
    <div className="boombox-container">
      <svg className="boombox" viewBox="0 0 800 400">
        <rect className="boombox-body" x="50" y="50" width="700" height="300" rx="20" />
        <circle className="speaker left" cx="200" cy="200" r="80" />
        <circle className="speaker right" cx="600" cy="200" r="80" />
        <rect className="display" x="300" y="100" width="200" height="50" rx="5" />
        <text x="400" y="130" textAnchor="middle" className="display-text">
          {audioFiles[currentTrack]?.title || 'No track selected'}
        </text>
        <g className="controls-group" transform="translate(300, 170)">
          <circle className="control-button" cx="50" cy="50" r="20" onClick={handlePrevTrack} />
          <text x="50" y="55" textAnchor="middle">⏮</text>
          <circle className="control-button" cx="100" cy="50" r="20" onClick={handlePlayPause} />
          <text x="100" y="55" textAnchor="middle">{isPlaying ? '⏸' : '▶'}</text>
          <circle className="control-button" cx="150" cy="50" r="20" onClick={handleNextTrack} />
          <text x="150" y="55" textAnchor="middle">⏭</text>
        </g>
      </svg>
    </div>
  );
};