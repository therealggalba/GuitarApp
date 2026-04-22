import React, { useRef, useState } from 'react';
import './AudioConsole.scss';

interface AudioConsoleProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
}

const AudioConsole: React.FC<AudioConsoleProps> = ({ src, onTimeUpdate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const changeRate = (delta: number) => {
    const newRate = Math.min(Math.max(playbackRate + delta, 0.5), 2.0);
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-console">
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="console-display">
        <div className="status-indicator">
          <span className={`dot ${isPlaying ? 'active' : ''}`}></span>
          <span className="text">{isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}</span>
        </div>
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="speed-display">
          SPEED: {playbackRate.toFixed(1)}x
        </div>
      </div>

      <div className="console-controls">
        <div className="main-actions">
          <button onClick={() => seek(-5)} className="control-btn" title="Back 5s">{'<<'}</button>
          <button onClick={() => seek(-0.1)} className="control-btn precision" title="Back 0.1s">{'<'}</button>
          <button onClick={togglePlay} className="control-btn main">
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button onClick={() => seek(0.1)} className="control-btn precision" title="Forward 0.1s">{'>'}</button>
          <button onClick={() => seek(5)} className="control-btn" title="Forward 5s">{'>>'}</button>
        </div>
        
        <div className="rate-actions">
          <button onClick={() => changeRate(-0.1)} className="rate-btn">- VOL</button>
          <button onClick={() => changeRate(0.1)} className="rate-btn">+ VOL</button>
        </div>
      </div>
    </div>
  );
};

export default AudioConsole;
