// File: src/hooks/useMeditationTTS.ts
// Simple version copying from therapy implementation

import { useState, useEffect, useCallback } from 'react';
import { ttsService } from '../services/ttsService';

export interface MeditationTTSState {
  isConnected: boolean;
  isSpeaking: boolean;
  currentChunk: string;
  error: string | null;
}

export interface MeditationTTSControls {
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  startMeditationCycle: (texts: string[], intervalMs?: number) => void;
  stopMeditationCycle: () => void;
}

export const useMeditationTTS = () => {
  const [state, setState] = useState<MeditationTTSState>({
    isConnected: false,
    isSpeaking: false,
    currentChunk: '',
    error: null
  });

  // Initialize TTS service
  useEffect(() => {
    const initializeTTS = async () => {
      try {
        console.log('Initializing TTS for meditation...');
        await ttsService.connect();
        
        // Set up TTS callbacks like therapy does
        ttsService.setEventCallbacks({
          onConnectionOpen: () => {
            console.log('Meditation TTS connected');
            setState(prev => ({ ...prev, isConnected: true, error: null }));
          },
          onConnectionClose: () => {
            console.log('Meditation TTS disconnected');
            setState(prev => ({ ...prev, isConnected: false, isSpeaking: false }));
          },
          onError: (error) => {
            console.error('Meditation TTS error:', error);
            setState(prev => ({ ...prev, error, isConnected: false }));
          },
          onAudioChunk: (chunk) => {
            console.log('Meditation audio chunk received:', chunk.chunk_id);
            setState(prev => ({ ...prev, currentChunk: chunk.text_chunk }));
          },
          onGenerationStarted: () => {
            console.log('Meditation TTS generation started');
            setState(prev => ({ ...prev, isSpeaking: true }));
          },
          onGenerationComplete: () => {
            console.log('Meditation TTS generation complete');
            setState(prev => ({ ...prev, isSpeaking: false }));
          }
        });

        console.log('Meditation TTS initialized successfully');
      } catch (error) {
        console.warn('Meditation TTS initialization failed:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'TTS not available - using browser speech',
          isConnected: false 
        }));
      }
    };

    initializeTTS();

    // Cleanup on unmount
    return () => {
      ttsService.disconnect();
    };
  }, []);

  // Speak function - exactly like therapy
  const speak = useCallback(async (text: string) => {
    try {
      if (state.isConnected) {
        console.log('Speaking with TTS:', text);
        await ttsService.convertTextToSpeech(text);
      } else {
        console.log('TTS not connected, using browser speech');
        // Fallback to browser speech like before
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.5;
        utterance.pitch = 0.1;
        utterance.volume = 0.9;
        
        utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
        utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Meditation speak failed:', error);
      // Always fallback to browser speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.5;
      utterance.pitch = 0.1;
      speechSynthesis.speak(utterance);
    }
  }, [state.isConnected]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (state.isConnected) {
      ttsService.stopAllAudio();
    }
    speechSynthesis.cancel();
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, [state.isConnected]);

  // Empty implementations for compatibility
  const startMeditationCycle = useCallback(() => {}, []);
  const stopMeditationCycle = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  return {
    state,
    controls: {
      speak,
      stopSpeaking,
      startMeditationCycle,
      stopMeditationCycle
    }
  };
};