import { useState, useEffect, useRef, useCallback } from 'react';
import backgroundAmbientAudio from '../assets/meditation/audio/background-ambient.mp3';

// Types for audio management
export interface AudioState {
  isPlaying: boolean;
  isSpeaking: boolean;
  currentNarrationIndex: number;
  audioError: string | null;
  speechError: string | null;
}

export interface AudioControls {
  playPause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
}

// Meditation narration chunks (5-6 words each)
const MEDITATION_CHUNKS = [
  "Welcome to this moment of stillness",
  "Settle into a comfortable position",
  "Allow your breath to soften",
  "Let your shoulders drop",
  "Feel your breath deepen naturally",
  "Notice the gentle rhythm of peace",
  "Let go of any tension",
  "Release thoughts that pull away",
  "Simply be here, now",
  "In this vast calm space",
  "Within and around you",
  "Rest in this peaceful awareness",
  "Allow your mind to settle",
  "Embrace this moment of tranquility",
  "Let peace fill your being"
] as const;

/**
 * Custom hook for managing meditation audio and speech synthesis
 * Handles background audio, speech narration, and error recovery
 */
export const useMeditationAudio = (
  enabled: boolean = true,
  speechEnabled: boolean = true,
  volume: number = 0.3
) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isSpeaking: false,
    currentNarrationIndex: 0,
    audioError: null,
    speechError: null,
  });

  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize background audio
  useEffect(() => {
    if (enabled) {
      try {
        const audio = new Audio(backgroundAmbientAudio);
        audio.loop = true;
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Error handling
        audio.onerror = () => {
          setAudioState(prev => ({ 
            ...prev, 
            audioError: 'Failed to load background audio' 
          }));
        };

        audio.oncanplay = () => {
          setAudioState(prev => ({ 
            ...prev, 
            audioError: null 
          }));
        };

        backgroundAudioRef.current = audio;
      } catch (error) {
        setAudioState(prev => ({ 
          ...prev, 
          audioError: `Audio initialization failed: ${error}` 
        }));
      }
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, [enabled, volume]);

  // Speech synthesis with error handling
  const speakText = useCallback((text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) {
      setAudioState(prev => ({ 
        ...prev, 
        speechError: 'Speech synthesis not supported' 
      }));
      return;
    }

    try {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.5;
      utterance.pitch = 0.1;
      utterance.volume = 0.9;
      
      // Find a suitable voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('ryan')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => {
        setAudioState(prev => ({ 
          ...prev, 
          isSpeaking: true, 
          speechError: null 
        }));
      };

      utterance.onend = () => {
        setAudioState(prev => ({ 
          ...prev, 
          isSpeaking: false 
        }));
      };

      utterance.onerror = (event) => {
        setAudioState(prev => ({ 
          ...prev, 
          isSpeaking: false,
          speechError: `Speech error: ${event.error}` 
        }));
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      setAudioState(prev => ({ 
        ...prev, 
        speechError: `Speech synthesis failed: ${error}` 
      }));
    }
  }, [speechEnabled]);

  // Play/pause background audio
  const playPause = useCallback(() => {
    if (!backgroundAudioRef.current || !enabled) return;

    try {
      if (audioState.isPlaying) {
        backgroundAudioRef.current.pause();
        speechSynthesis.pause();
        if (narrationTimeoutRef.current) {
          clearTimeout(narrationTimeoutRef.current);
        }
      } else {
        backgroundAudioRef.current.play().catch(error => {
          setAudioState(prev => ({ 
            ...prev, 
            audioError: `Playback failed: ${error}` 
          }));
        });
        speechSynthesis.resume();
      }
      
      setAudioState(prev => ({ 
        ...prev, 
        isPlaying: !prev.isPlaying 
      }));
    } catch (error) {
      setAudioState(prev => ({ 
        ...prev, 
        audioError: `Play/pause failed: ${error}` 
      }));
    }
  }, [audioState.isPlaying, enabled]);

  // Stop all audio
  const stop = useCallback(() => {
    try {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
      
      speechSynthesis.cancel();
      
      if (narrationTimeoutRef.current) {
        clearTimeout(narrationTimeoutRef.current);
      }
      
      setAudioState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isSpeaking: false,
        currentNarrationIndex: 0
      }));
    } catch (error) {
      setAudioState(prev => ({ 
        ...prev, 
        audioError: `Stop failed: ${error}` 
      }));
    }
  }, []);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  // Stop speech synthesis
  const stopSpeech = useCallback(() => {
    speechSynthesis.cancel();
    setAudioState(prev => ({ 
      ...prev, 
      isSpeaking: false 
    }));
  }, []);

  // Start meditation narration cycle
  const startNarrationCycle = useCallback(() => {
    if (!speechEnabled || !audioState.isPlaying) return;

    const cycleNarration = () => {
      const currentChunk = MEDITATION_CHUNKS[audioState.currentNarrationIndex];
      speakText(currentChunk);
      
      setAudioState(prev => ({
        ...prev,
        currentNarrationIndex: (prev.currentNarrationIndex + 1) % MEDITATION_CHUNKS.length
      }));

      // Schedule next narration (12 seconds interval)
      narrationTimeoutRef.current = setTimeout(cycleNarration, 12000);
    };

    // Start first narration after a short delay
    narrationTimeoutRef.current = setTimeout(cycleNarration, 500);
  }, [speechEnabled, audioState.isPlaying, audioState.currentNarrationIndex, speakText]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (narrationTimeoutRef.current) {
        clearTimeout(narrationTimeoutRef.current);
      }
    };
  }, []);

  const controls: AudioControls = {
    playPause,
    stop,
    setVolume,
    speakText,
    stopSpeech,
  };

  return {
    audioState,
    controls,
    startNarrationCycle,
    meditationChunks: MEDITATION_CHUNKS,
    currentChunk: MEDITATION_CHUNKS[audioState.currentNarrationIndex],
  };
};