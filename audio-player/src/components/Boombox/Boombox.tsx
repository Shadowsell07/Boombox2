import React, { useState } from 'react';
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

  return (
    <div className="boombox-container">
      <svg className="boombox" viewBox="0 0 800 400">
        {/* Main body */}
        <rect className="boombox-body" x="50" y="50" width="700" height="300" rx="20" />
        
        {/* Speakers */}
        <circle className="speaker left" cx="200" cy="200" r="80" />
        <circle className="speaker right" cx="600" cy="200" r="80" />
        
        {/* Display panel */}
        <rect className="display" x="300" y="100" width="200" height="50" rx="5" />
        
        {/* Controls panel */}
        <rect className="controls" x="300" y="170" width="200" height="100" rx="10" />
      </svg>
    </div>
  );
};