import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useMeditationAudio } from '../hooks/useMeditationAudio';
import { useMeditationTheme } from '../hooks/useMeditationTheme';
import { type MeditationSettings } from '../hooks/useMeditationStore';
import meditationFigure from '../assets/meditation/meditation-figure.png';
import './meditation.css';

interface MeditationSessionProps {
  settings: MeditationSettings;
  onEndSession: (completedDuration: number) => void;
}

export const MeditationSession: React.FC<MeditationSessionProps> = ({ 
  settings, 
  onEndSession 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(settings.sessionDuration * 60); // Convert to seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const [showTransition, setShowTransition] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { audioState, controls, startNarrationCycle, currentChunk } = useMeditationAudio(
    settings.backgroundAudioEnabled,
    settings.speechEnabled,
    settings.backgroundAudioVolume
  );
  
  const { themeState, changeTheme, getThemeCSSVariables, getOrbColors } = useMeditationTheme(
    settings.selectedTheme
  );

  // Initialize theme
  useEffect(() => {
    changeTheme(settings.selectedTheme);
  }, [settings.selectedTheme, changeTheme]);

  // Handle transition animation
  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setShowTransition(false);
      if (settings.backgroundAudioEnabled) {
        controls.playPause();
      }
      if (settings.speechEnabled) {
        startNarrationCycle();
      }
    }, 2000);

    return () => clearTimeout(transitionTimer);
  }, [settings, controls, startNarrationCycle]);

  // Session timer
  const handleEndSession = useCallback(() => {
    const completedDuration = Math.round((settings.sessionDuration * 60 - timeRemaining) / 60);
    controls.stop();
    onEndSession(completedDuration);
  }, [settings.sessionDuration, timeRemaining, controls, onEndSession]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0 && !showTransition) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, showTransition, handleEndSession]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    controls.playPause();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const orbColors = getOrbColors();
  const themeVars = getThemeCSSVariables();

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="relative">
          {/* Burst Animation */}
          <div 
            className="w-32 h-32 rounded-full burst-animation"
            style={{
              background: `radial-gradient(circle, ${orbColors.inner} 0%, ${orbColors.middle} 50%, ${orbColors.outer} 100%)`,
              animationDuration: '2s',
              animationIterationCount: '1',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-lg font-medium">Preparing your space...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={themeVars as React.CSSProperties}
    >
      {/* Background Theme */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div 
          className="absolute inset-0"
          style={{ background: (themeVars as Record<string, string>)['--theme-background'] }}
        />
        
        {/* Stars */}
        {themeState.stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-white star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${star.speed}s`,
            }}
          />
        ))}

        {/* Particles */}
        {themeState.particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="absolute rounded-full particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: `hsl(${particle.hue}, 70%, 60%)`,
              animationDuration: `${particle.speed * 10}s`,
              animationDelay: `${particle.speed}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Meditation Figure Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Responsive Orb Background */}
        <div className="relative">
          <div 
            className={`absolute inset-0 rounded-full meditation-orb ${
              audioState.isSpeaking ? 'orb-active' : ''
            }`}
            style={{
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle, ${orbColors.inner} 0%, ${orbColors.middle} 50%, ${orbColors.outer} 100%)`,
              filter: 'blur(20px)',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
            }}
          />
          
          {/* Meditation Figure */}
          <div className="relative z-10 flex items-center justify-center">
            <img
              src={meditationFigure}
              alt="Meditation Figure"
              className={`w-80 h-80 object-contain meditation-figure ${
                isPlaying ? 'playing' : ''
              }`}
              style={{
                filter: audioState.isSpeaking 
                  ? 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))' 
                  : 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Meditation Text */}
      {settings.speechEnabled && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="glassmorphic-text-box rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-white text-lg font-medium text-center max-w-md">
              {currentChunk}
            </p>
          </div>
        </div>
      )}

      {/* Session Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="text-white text-2xl font-mono font-bold">
              {formatTime(timeRemaining)}
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20 p-3"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEndSession}
                className="text-white hover:bg-white/20 p-3"
              >
                <Square className="h-6 w-6" />
              </Button>
              
              {settings.backgroundAudioEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => controls.setVolume(audioState.isPlaying ? 0 : settings.backgroundAudioVolume)}
                  className="text-white hover:bg-white/20 p-3"
                >
                  {audioState.isPlaying ? (
                    <Volume2 className="h-6 w-6" />
                  ) : (
                    <VolumeX className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {(audioState.audioError || audioState.speechError) && (
            <div className="mt-3 text-red-300 text-sm text-center">
              {audioState.audioError && <div>Audio: {audioState.audioError}</div>}
              {audioState.speechError && <div>Speech: {audioState.speechError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};