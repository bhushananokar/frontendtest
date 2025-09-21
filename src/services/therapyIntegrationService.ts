// Main Integration Service - Orchestrates the complete STT → Therapist → TTS flow
import { sttService } from './sttService';
import { therapistService, TherapistResponse, SessionInfo } from './therapistService';
import { ttsService, TTSChunk } from './ttsService';

export interface TherapyFlowState {
  phase: 'idle' | 'listening' | 'processing_speech' | 'thinking' | 'speaking' | 'error';
  isActive: boolean;
  currentMessage?: string;
  error?: string;
  sessionInfo?: SessionInfo;
}

export interface TherapyFlowCallbacks {
  onStateChange?: (state: TherapyFlowState) => void;
  onUserTranscription?: (transcription: string) => void;
  onTherapistResponse?: (response: TherapistResponse) => void;
  onAudioChunk?: (chunk: TTSChunk) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

class TherapyIntegrationService {
  private currentState: TherapyFlowState = {
    phase: 'idle',
    isActive: false
  };
  
  private callbacks: TherapyFlowCallbacks = {};
  private isInitialized: boolean = false;

  /**
   * Initialize the therapy service
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing Therapy Integration Service...');
      
      // Connect to TTS WebSocket first
      console.log('Connecting to TTS WebSocket...');
      try {
        await ttsService.connect();
        console.log('TTS WebSocket connected successfully');
        
        // Set up TTS event callbacks
        ttsService.setEventCallbacks({
          onConnectionOpen: () => {
            console.log('TTS connected successfully');
          },
          onConnectionClose: () => {
            console.log('TTS disconnected');
            this.handleError('TTS connection lost');
          },
          onError: (error) => {
            this.handleError(`TTS error: ${error}`);
          },
          onAudioChunk: (chunk) => {
            this.callbacks.onAudioChunk?.(chunk);
          },
          onGenerationStarted: () => {
            this.updateState({ phase: 'speaking' });
          },
          onGenerationComplete: () => {
            this.updateState({ phase: 'idle' });
            this.callbacks.onComplete?.();
          }
        });
      } catch (ttsError) {
        console.warn('TTS WebSocket connection failed, continuing without TTS:', ttsError);
        // Continue initialization even if TTS fails
      }

      // Initialize therapy session
      console.log('Initializing therapy session...');
      const sessionInfo = await therapistService.initializeSession();
      console.log('Therapy session initialized:', sessionInfo);
      
      this.updateState({ 
        phase: 'idle', 
        isActive: true,
        sessionInfo 
      });

      this.isInitialized = true;
      console.log('Therapy Integration Service initialized successfully');

      // Speak the initial therapist message (non-blocking, only if TTS is available)
      if (sessionInfo.initial_message && ttsService.isConnectedToTTS()) {
        console.log('Speaking initial message:', sessionInfo.initial_message);
        this.speakText(sessionInfo.initial_message).catch((error) => {
          console.error('Error speaking initial message:', error);
        });
      } else if (sessionInfo.initial_message) {
        console.log('TTS not available, skipping initial message speech');
        // Just set the text without speaking
        this.callbacks.onTherapistResponse?.({
          response: sessionInfo.initial_message,
          phase: 'idle',
          phase_changed: false,
          conversation_count: 0,
          detected_symptoms: [],
          session_completed: false
        });
      }
      
    } catch (error) {
      console.error('Error initializing therapy service:', error);
      this.handleError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Start the complete therapy flow: Listen → Process → Respond
   */
  async startTherapyFlow(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    if (this.currentState.phase !== 'idle') {
      throw new Error(`Cannot start flow from current state: ${this.currentState.phase}`);
    }

    try {
      console.log('Starting therapy flow...');
      
      // Phase 1: Listen to user
      await this.listenToUser();
      
    } catch (error) {
      console.error('Error in therapy flow:', error);
      this.handleError(error instanceof Error ? error.message : 'Therapy flow failed');
    }
  }

  /**
   * Phase 1: Listen to user speech
   */
  private async listenToUser(): Promise<void> {
    try {
      this.updateState({ phase: 'listening' });
      
      // Start recording
      await sttService.startRecording();
      console.log('Listening to user...');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      this.handleError('Failed to start recording. Please check microphone permissions.');
    }
  }

  /**
   * Stop listening and process user speech
   */
  async stopListeningAndProcess(): Promise<void> {
    if (this.currentState.phase !== 'listening') {
      console.warn('Not currently listening');
      return;
    }

    try {
      this.updateState({ phase: 'processing_speech' });
      
      // Phase 2: Process speech with STT
      const sttResponse = await sttService.stopRecordingAndTranscribe();
      
      if (sttResponse.error) {
        throw new Error(sttResponse.error);
      }

      if (!sttResponse.transcription || sttResponse.transcription.trim().length === 0) {
        throw new Error('No speech detected. Please try again.');
      }

      console.log('User said:', sttResponse.transcription);
      this.callbacks.onUserTranscription?.(sttResponse.transcription);

      // Phase 3: Get therapist response
      await this.processWithTherapist(sttResponse.transcription);
      
    } catch (error) {
      console.error('Error processing user speech:', error);
      this.handleError(error instanceof Error ? error.message : 'Failed to process speech');
    }
  }

  /**
   * Phase 3: Process with therapist
   */
  private async processWithTherapist(userMessage: string): Promise<void> {
    try {
      this.updateState({ phase: 'thinking' });
      
      const therapistResponse = await therapistService.sendMessage(userMessage);
      
      if (therapistResponse.error) {
        throw new Error(therapistResponse.error);
      }

      console.log('Therapist response:', therapistResponse.response);
      this.callbacks.onTherapistResponse?.(therapistResponse);

      // Check for crisis alert
      if (therapistResponse.crisis_alert) {
        console.warn('Crisis alert detected:', therapistResponse.crisis_alert);
        this.callbacks.onError?.(`Crisis detected: ${therapistResponse.crisis_alert}`);
      }

      // Phase 4: Convert to speech
      await this.speakText(therapistResponse.response);
      
    } catch (error) {
      console.error('Error processing with therapist:', error);
      this.handleError(error instanceof Error ? error.message : 'Therapist processing failed');
    }
  }

  /**
   * Phase 4: Convert text to speech and play
   */
  private async speakText(text: string): Promise<void> {
    try {
      this.updateState({ 
        phase: 'speaking',
        currentMessage: text 
      });
      
      await ttsService.convertTextToSpeech(text);
      console.log('Started TTS conversion for:', text);
      
    } catch (error) {
      console.error('Error converting text to speech:', error);
      this.handleError('Failed to convert response to speech');
    }
  }

  /**
   * Cancel current operation and return to idle
   */
  cancelCurrentOperation(): void {
    console.log('Cancelling current operation...');
    
    // Stop any ongoing recording
    if (sttService.isRecording()) {
      sttService.cancelRecording();
    }
    
    // Stop any ongoing audio playback
    ttsService.stopAllAudio();
    
    this.updateState({ phase: 'idle' });
  }

  /**
   * Shutdown the service
   */
  shutdown(): void {
    console.log('Shutting down Therapy Integration Service...');
    
    this.cancelCurrentOperation();
    ttsService.disconnect();
    therapistService.endSession();
    
    this.isInitialized = false;
    this.updateState({ 
      phase: 'idle', 
      isActive: false 
    });
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: TherapyFlowCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current state
   */
  getCurrentState(): TherapyFlowState {
    return { ...this.currentState };
  }

  /**
   * Check if service is ready for interaction
   */
  isReady(): boolean {
    return this.isInitialized && this.currentState.phase === 'idle';
  }

  /**
   * Check if currently processing
   */
  isProcessing(): boolean {
    return ['listening', 'processing_speech', 'thinking', 'speaking'].includes(this.currentState.phase);
  }

  /**
   * Get session information
   */
  getSessionInfo(): SessionInfo | undefined {
    return this.currentState.sessionInfo;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): Array<{user: string, ai: string, timestamp: string}> {
    return therapistService.getConversationHistory();
  }

  /**
   * Update state and notify callbacks
   */
  private updateState(updates: Partial<TherapyFlowState>): void {
    this.currentState = { 
      ...this.currentState, 
      ...updates 
    };
    
    console.log('State updated:', this.currentState.phase);
    this.callbacks.onStateChange?.(this.currentState);
  }

  /**
   * Handle errors
   */
  private handleError(error: string): void {
    console.error('Therapy flow error:', error);
    
    this.updateState({ 
      phase: 'error',
      error 
    });
    
    this.callbacks.onError?.(error);
    
    // Return to idle after error
    setTimeout(() => {
      if (this.currentState.phase === 'error') {
        this.updateState({ 
          phase: 'idle',
          error: undefined 
        });
      }
    }, 3000);
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{stt: boolean, therapist: boolean, tts: boolean}> {
    const results = {
      stt: true, // STT service is simple HTTP, assume healthy if reachable
      therapist: false,
      tts: false
    };

    try {
      results.therapist = await therapistService.healthCheck();
    } catch (error) {
      console.error('Therapist health check failed:', error);
    }

    try {
      results.tts = ttsService.isConnectedToTTS();
    } catch (error) {
      console.error('TTS health check failed:', error);
    }

    return results;
  }
}

// Export singleton instance
export const therapyIntegrationService = new TherapyIntegrationService();