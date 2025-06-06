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
      <svg className="boombox" viewBox="0 0 1200 600">
        <defs>
          <pattern 
            id="boomboxPattern" 
            patternUnits="userSpaceOnUse" 
            width="900"    // Match boombox body width
            height="500"   // Match boombox body height
          >
            <image
              href="/images/Dsell1.jpg"  // Update to correct image name
              width="900"   // Match pattern width
              height="500"  // Match pattern height
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        
        {/* Update boombox body position and size */}
        <rect 
          className="boombox-body" 
          x="150"     // Increased from 50 to center everything
          y="50" 
          width="900"
          height="500"
          rx="30"
          fill="url(#boomboxPattern)"
        />
        
        {/* Adjust all component positions */}
        <circle 
          className="speaker left" 
          cx="300" 
          cy="300" 
          r="120" 
        />
        <circle 
          className="speaker right" 
          cx="900"    // Decreased from 900 to fit inside body
          cy="300" 
          r="120" 
        />
        {/* Center the display */}
        <rect 
          className="display" 
          x="450"    // Adjusted to center with controls
          y="150" 
          width="300" 
          height="75" 
          rx="8" 
        />
        <text 
          x="600"    // Matched with controls group translate x value
          y="195" 
          textAnchor="middle" 
          className="display-text"
        >
          {audioFiles[currentTrack]?.title || 'No track selected'}
        </text>

        {/* Center the playback controls */}
        <g className="controls-group" transform="translate(600, 270)">
          <circle className="control-button" cx="-120" cy="0" r="25" onClick={handlePrevTrack} />
          <text x="-120" y="7" textAnchor="middle" fontSize="24">⏮</text>
          
          <circle className="control-button" cx="0" cy="0" r="25" onClick={handlePlayPause} />
          <text x="0" y="7" textAnchor="middle" fontSize="24">{isPlaying ? '⏸' : '▶'}</text>
          
          <circle className="control-button" cx="120" cy="0" r="25" onClick={handleNextTrack} />
          <text x="120" y="7" textAnchor="middle" fontSize="24">⏭</text>
        </g>

        {/* Center the volume controls and align with bottom of speakers */}
        <g className="volume-control" transform="translate(600, 420)">
          <circle className="control-button" cx="-50" cy="0" r="25" onClick={handleVolumeDecrease} />
          <text x="-50" y="7" textAnchor="middle" fontSize="24">−</text>

          <circle className="control-button" cx="50" cy="0" r="25" onClick={handleVolumeIncrease} />
          <text x="50" y="7" textAnchor="middle" fontSize="24">+</text>

          <text x="-120" y="5" className="volume-label" fontSize="18">VOL</text>
        </g>
      </svg>
    </div>
  );
};