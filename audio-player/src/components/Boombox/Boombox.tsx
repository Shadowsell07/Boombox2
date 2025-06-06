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
  const [speakerScale, setSpeakerScale] = useState(1);
  const audioService = useRef(new AudioService());
  const animationFrame = useRef<number | undefined>(undefined);

  // Update the initial useEffect to only run once
  useEffect(() => {
    audioService.current.loadTrack(audioFiles[currentTrack].url);
    audioService.current.setVolume(volume);
    audioService.current.setupAnalyser();  // Set up once when component mounts
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []); // Empty deps array means this runs once on mount

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
    try {
      if (isPlaying) {
        audioService.current.pause();
      } else {
        await audioService.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback failed:', error);
      setIsPlaying(false);
    }
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

  useEffect(() => {
    const updateAnimation = () => {
      if (isPlaying) {
        const audioData = audioService.current.getAudioData();
        if (audioData) {
          const average = (audioData[0] + audioData[1] + audioData[2]) / 3;
          const scale = 1 + (average / 255) * 0.1;
          setSpeakerScale(scale);
          
          // Update animation speeds based on audio
          const speed = 3 - (average / 255) * 2; // Between 1-3s
          document.documentElement.style.setProperty('--wave-duration', `${speed}s`);
          document.documentElement.style.setProperty('--note-duration', `${speed * 1.5}s`);
        }
      }
      animationFrame.current = requestAnimationFrame(updateAnimation);
    };

    updateAnimation();
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isPlaying]);

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
          
          {/* Left speaker pattern */}
          <pattern 
            id="speakerPatternLeft" 
            patternUnits="userSpaceOnUse" 
            width="240"
            height="240"
            patternTransform="translate(-60, -60)"  // Keep current transform for left speaker
          >
            <circle cx="120" cy="120" r="115" fill="#181818" />
            <circle cx="120" cy="120" r="90" fill="#202020" />
            <circle cx="120" cy="120" r="60" fill="#181818" />
            <circle cx="120" cy="120" r="30" fill="#303030" />
          </pattern>

          {/* Right speaker pattern */}
          <pattern 
            id="speakerPatternRight" 
            patternUnits="userSpaceOnUse" 
            width="240"
            height="240"
            patternTransform="translate(-180, -60)"  // Adjusted for right speaker
          >
            <circle cx="120" cy="120" r="115" fill="#181818" />
            <circle cx="120" cy="120" r="90" fill="#202020" />
            <circle cx="120" cy="120" r="60" fill="#181818" />
            <circle cx="120" cy="120" r="30" fill="#303030" />
          </pattern>

          {/* Add wave path */}
          <path 
            id="wavePath" 
            d="M0,25 Q30,5 60,25 Q90,45 120,25 Q150,5 180,25" 
            fill="none" 
            stroke="#4B9CD3"  /* Changed from #505050 to Carolina Blue */
            strokeWidth="2"
          />
          
          {/* Add music note symbol */}
          <symbol id="musicNote" viewBox="0 0 20 32">
            <path 
              d="M10,0 L10,20 C10,24 6,28 0,24 C-4,22 -4,16 0,14 C4,12 10,14 10,18"
              fill="#4B9CD3"  /* Carolina Blue color */
            />
          </symbol>

          {/* Add star symbol */}
          <symbol id="star" viewBox="0 0 20 20">
            <path
              d="M10,0 L12,7 L19,7 L14,12 L16,19 L10,15 L4,19 L6,12 L1,7 L8,7 Z"
              fill="#ffffbe"
            />
          </symbol>
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
        
        {/* Update speakers with pattern */}
        <circle 
          className="speaker left" 
          cx="300" 
          cy="300" 
          r="120"
          fill="url(#speakerPatternLeft)"
          style={{ transform: `scale(${speakerScale})`, transformOrigin: 'center' }}
        />
        <circle 
          className="speaker right" 
          cx="900" 
          cy="300" 
          r="120"
          fill="url(#speakerPatternRight)"
          style={{ transform: `scale(${speakerScale})`, transformOrigin: 'center' }}
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

        {/* Animated waves - adjust transform and container width */}
        <g className="waves-container" transform="translate(170, 480)">
          {[0, 1, 2, 3, 4].map((i) => (
            <use 
              key={`wave${i}`} 
              href="#wavePath" 
              className="wave-animation"
              style={{
                animation: `waveMove 6s infinite ${i * 0.8}s linear`
              }}
            />
          ))}
        </g>

        {/* Animated music notes - spread across full width */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <use 
            key={`note${i}`}
            href="#musicNote"
            className="note-animation"
            width="20"
            height="32"
            x={200 + (i * 150)}
            y="460"
            style={{
              animation: `noteFloat 4s infinite ${i * 0.6}s ease-in-out`
            }}
          />
        ))}

        {/* Animated stars at the top - mirroring note animation style */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <use
            key={`star${i}`}
            href="#star"
            className="star-animation"
            width="15"
            height="15"
            x={200 + (i * 150)}
            y="80"
            style={{
              animation: `starFloat 4s infinite ${i * 0.6}s ease-in-out`
            }}
          />
        ))}
      </svg>
    </div>
  );
};