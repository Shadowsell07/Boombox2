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
      <svg className="boombox" viewBox="0 0 1200 600"> {/* Increased from 800 400 */}
        <defs>
          <pattern 
            id="boomboxPattern" 
            patternUnits="userSpaceOnUse" 
            width="1100"
            height="500"
            patternTransform="translate(0, 100)" // Add this to shift pattern down
          >
            <image
              href="/images/Dsell1.jpg"  // Make sure filename matches your image
              width="1100"
              height="700"  // Increase height to have more room to shift
              y="-100"      // Shift image up within pattern to show lower portion
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        
        {/* Update the boombox body size */}
        <rect 
          className="boombox-body" 
          x="50" 
          y="50" 
          width="1100"     /* Increased from 700 */
          height="500"     /* Increased from 300 */
          rx="30"          /* Increased from 20 */
          fill="url(#boomboxPattern)"
        />
        
        {/* Adjust other component positions proportionally */}
        <circle className="speaker left" cx="300" cy="300" r="120" /> {/* Adjusted position and size */}
        <circle className="speaker right" cx="900" cy="300" r="120" /> {/* Adjusted position and size */}
        <rect className="display" x="450" y="150" width="300" height="75" rx="8" /> {/* Adjusted position and size */}
        <text x="600" y="190" textAnchor="middle" className="display-text">
          {audioFiles[currentTrack]?.title || 'No track selected'}
        </text>
        <g className="controls-group" transform="translate(600, 270)">
          <circle className="control-button" cx="-100" cy="0" r="30" onClick={handlePrevTrack} />
          <text x="-100" y="5" textAnchor="middle">⏮</text>
          <circle className="control-button" cx="0" cy="0" r="30" onClick={handlePlayPause} />
          <text x="0" y="5" textAnchor="middle">{isPlaying ? '⏸' : '▶'}</text>
          <circle className="control-button" cx="100" cy="0" r="30" onClick={handleNextTrack} />
          <text x="100" y="5" textAnchor="middle">⏭</text>
        </g>
        
        {/* Add volume slider after controls group */}
        <g className="volume-control" transform="translate(600, 350)">
          {/* Minus button */}
          <circle 
            className="control-button" 
            cx="-40" 
            cy="10" 
            r="20" 
            onClick={handleVolumeDecrease} 
          />
          <text x="-40" y="15" textAnchor="middle">−</text>

          {/* Volume bar */}
          <rect
            className="volume-bg"
            x="0"
            y="0"
            width="400"
            height="20"
            rx="10"
          />
          <rect
            className="volume-level"
            x="0"
            y="0"
            width={400 * volume}
            height="20"
            rx="10"
          />

          {/* Plus button */}
          <circle 
            className="control-button" 
            cx="60" 
            cy="10" 
            r="20" 
            onClick={handleVolumeIncrease} 
          />
          <text x="60" y="15" textAnchor="middle">+</text>

          <text x="-100" y="15" className="volume-label">VOL</text>
        </g>
      </svg>
    </div>
  );
};