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

  // Update the initial useEffect to only run once
  useEffect(() => {
    audioService.current.loadTrack(audioFiles[currentTrack].url);
    audioService.current.setVolume(volume);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []); // Keep this for initial setup

  // Add new useEffect to handle track changes
  useEffect(() => {
    const loadAndPlayTrack = async () => {
      await audioService.current.loadTrack(audioFiles[currentTrack].url);
      if (isPlaying) {
        await audioService.current.play();
      }
    };
    loadAndPlayTrack();
  }, [currentTrack]); // This will run whenever currentTrack changes

  useEffect(() => {
    console.log('Current track:', currentTrack);
    console.log('Is playing:', isPlaying);
    console.log('Volume:', volume);
  }, [currentTrack, isPlaying, volume]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioService.current.pause();
    } else {
      await audioService.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = async () => {
    setCurrentTrack(prev => (prev < audioFiles.length - 1 ? prev + 1 : 0));
    setIsPlaying(true); // Automatically start playing the next track
  };

  const handlePrevTrack = async () => {
    setCurrentTrack(prev => (prev > 0 ? prev - 1 : audioFiles.length - 1));
    setIsPlaying(true); // Automatically start playing the previous track
  };

  const handleVolumeChange = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate relative position within the container
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(1, x / width));
    setVolume(newVolume);
    audioService.current.setVolume(newVolume);
    console.log('Volume set to:', newVolume); // Debug log
  };

  // Add these handlers after your existing handle functions
  const handleVolumeIncrease = () => {
    const newVolume = Math.min(1, volume + 0.1);
    setVolume(newVolume);
    audioService.current.setVolume(newVolume);
  };

  const handleVolumeDecrease = () => {
    const newVolume = Math.max(0, volume - 0.1);
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
        
        {/* Add volume slider after controls group */}
        <g className="volume-control" transform="translate(300, 250)">
          {/* Minus button */}
          <circle 
            className="control-button" 
            cx="-20" 
            cy="10" 
            r="15" 
            onClick={handleVolumeDecrease} 
          />
          <text x="-20" y="15" textAnchor="middle">−</text>

          {/* Volume bar */}
          <rect
            className="volume-bg"
            x="0"
            y="0"
            width="200"
            height="20"
            rx="10"
          />
          <rect
            className="volume-level"
            x="0"
            y="0"
            width={200 * volume}
            height="20"
            rx="10"
          />

          {/* Plus button */}
          <circle 
            className="control-button" 
            cx="220" 
            cy="10" 
            r="15" 
            onClick={handleVolumeIncrease} 
          />
          <text x="220" y="15" textAnchor="middle">+</text>

          <text x="-50" y="15" className="volume-label">VOL</text>
        </g>
      </svg>
    </div>
  );
};