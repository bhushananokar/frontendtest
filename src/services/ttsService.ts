// TTS Service - Handle WebSocket-based text-to-speech conversion
export interface TTSChunk {
  chunk_id: number;
  total_chunks: number;
  text_chunk: string;
  audio_data: string; // base64 encoded WAV data
  sample_rate: number;
  is_final: boolean;
}

export interface TTSResponse {
  type: string;
  data?: any;
  message?: string;
  chunk_id?: number;
  total_chunks?: number;
  text_chunk?: string;
}

export interface TTSRequest {
  type: string;
  data: {
    text: string;
    voice?: string;
    parameters?: {
      speed?: number;
      pitch?: number;
    };
  };
}

export interface AudioChunk {
  id: number;
  audioBuffer: ArrayBuffer;
  textChunk: string;
  isPlaying: boolean;
  audioElement?: HTMLAudioElement;
}

class TTSService {
  private readonly WS_URL = 'ws://ws.mymindspace.in/ws/tts'; // Back to original
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private audioQueue: AudioChunk[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlayingQueue: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // 1 second

  // Event callbacks
  private onConnectionOpen?: () => void;
  private onConnectionClose?: () => void;
  private onError?: (error: string) => void;
  private onAudioChunk?: (chunk: TTSChunk) => void;
  private onGenerationComplete?: (data: any) => void;
  private onGenerationStarted?: (data: any) => void;

  /**
   * Connect to TTS WebSocket
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to TTS WebSocket:', this.WS_URL);
        
        this.websocket = new WebSocket(this.WS_URL);

        this.websocket.onopen = () => {
          console.log('TTS WebSocket connected successfully');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.onConnectionOpen?.();
          resolve();
        };

        this.websocket.onclose = (event) => {
          console.log('TTS WebSocket disconnected:', event.code, event.reason);
          console.log('Was clean close:', event.wasClean);
          this.isConnected = false;
          this.onConnectionClose?.();
          
          // Attempt to reconnect if not a clean close
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.websocket.onerror = (error) => {
          console.error('TTS WebSocket error:', error);
          console.error('WebSocket ready state:', this.websocket?.readyState);
          this.onError?.('WebSocket connection error');
          reject(new Error('Failed to connect to TTS service'));
        };

        this.websocket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            console.error('TTS WebSocket connection timeout');
            this.websocket?.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000); // 10 second timeout

      } catch (error) {
        console.error('Error connecting to TTS WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close(1000, 'Client disconnect');
      this.websocket = null;
    }
    this.isConnected = false;
    this.stopAllAudio();
  }

  /**
   * Send text for TTS conversion
   */
  async convertTextToSpeech(text: string, voice: string = 'Indigo-PlayAI'): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('TTS WebSocket not connected');
    }

    const request: TTSRequest = {
      type: 'text_input',
      data: {
        text: text,
        voice: voice,
        parameters: {
          speed: 1.0,
          pitch: 1.0
        }
      }
    };

    console.log('Sending TTS request:', request);
    this.websocket.send(JSON.stringify(request));
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    try {
      const response: TTSResponse = JSON.parse(data);
      console.log('TTS message received:', response.type);

      switch (response.type) {
        case 'connection':
          console.log('TTS connection established:', response.data);
          break;

        case 'generation_started':
          console.log('TTS generation started:', response.data);
          this.onGenerationStarted?.(response.data);
          break;

        case 'audio_chunk':
          if (response.data) {
            this.handleAudioChunk(response.data as TTSChunk);
          }
          break;

        case 'generation_complete':
          console.log('TTS generation complete:', response.data);
          this.onGenerationComplete?.(response.data);
          break;

        case 'error':
          console.error('TTS error:', response.message);
          this.onError?.(response.message || 'TTS generation error');
          break;

        case 'pong':
          console.log('TTS pong received');
          break;

        default:
          console.log('Unknown TTS message type:', response.type);
      }
    } catch (error) {
      console.error('Error parsing TTS message:', error);
    }
  }

  /**
   * Handle audio chunk and add to queue
   */
  private handleAudioChunk(chunk: TTSChunk): void {
    try {
      console.log(`Received audio chunk ${chunk.chunk_id}/${chunk.total_chunks}`);
      
      // Decode base64 audio data
      const audioBytes = Uint8Array.from(atob(chunk.audio_data), c => c.charCodeAt(0));
      const audioBuffer = audioBytes.buffer;

      // Create audio chunk
      const audioChunk: AudioChunk = {
        id: chunk.chunk_id,
        audioBuffer: audioBuffer,
        textChunk: chunk.text_chunk,
        isPlaying: false
      };

      // Add to queue
      this.audioQueue.push(audioChunk);
      
      // Trigger queue processing
      this.processAudioQueue();
      
      // Notify callback
      this.onAudioChunk?.(chunk);

    } catch (error) {
      console.error('Error handling audio chunk:', error);
    }
  }

  /**
   * Process audio queue and play chunks sequentially
   */
  private async processAudioQueue(): Promise<void> {
    if (this.isPlayingQueue || this.audioQueue.length === 0) {
      return;
    }

    this.isPlayingQueue = true;

    try {
      // Sort queue by chunk ID to ensure correct order
      this.audioQueue.sort((a, b) => a.id - b.id);

      for (const chunk of this.audioQueue) {
        if (!chunk.isPlaying) {
          await this.playAudioChunk(chunk);
        }
      }

      // Clear played chunks
      this.audioQueue = this.audioQueue.filter(chunk => !chunk.isPlaying);
      
    } catch (error) {
      console.error('Error processing audio queue:', error);
    } finally {
      this.isPlayingQueue = false;
    }
  }

  /**
   * Play individual audio chunk
   */
  private playAudioChunk(chunk: AudioChunk): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create blob from audio buffer
        const audioBlob = new Blob([chunk.audioBuffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create audio element
        const audioElement = new Audio(audioUrl);
        chunk.audioElement = audioElement;
        this.currentAudioElement = audioElement;

        audioElement.onloadeddata = () => {
          console.log(`Playing audio chunk ${chunk.id}: "${chunk.textChunk}"`);
          chunk.isPlaying = true;
          audioElement.play();
        };

        audioElement.onended = () => {
          console.log(`Finished playing audio chunk ${chunk.id}`);
          URL.revokeObjectURL(audioUrl);
          chunk.isPlaying = true; // Mark as played
          resolve();
        };

        audioElement.onerror = (error) => {
          console.error(`Error playing audio chunk ${chunk.id}:`, error);
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };

        audioElement.load();

      } catch (error) {
        console.error('Error creating audio element:', error);
        reject(error);
      }
    });
  }

  /**
   * Stop all audio playback
   */
  stopAllAudio(): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    // Stop all audio elements in queue
    this.audioQueue.forEach(chunk => {
      if (chunk.audioElement) {
        chunk.audioElement.pause();
        chunk.audioElement.currentTime = 0;
      }
    });

    // Clear the queue
    this.audioQueue = [];
    this.isPlayingQueue = false;
    
    console.log('All audio stopped and queue cleared');
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect TTS WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
          this.onError?.('Failed to reconnect to TTS service');
        }
      });
    }, this.reconnectDelay * this.reconnectAttempts); // Exponential backoff
  }

  /**
   * Send ping to keep connection alive
   */
  ping(): void {
    if (this.isConnected && this.websocket) {
      const pingMessage = {
        type: 'ping',
        data: { timestamp: Date.now() }
      };
      this.websocket.send(JSON.stringify(pingMessage));
    }
  }

  /**
   * Set event callbacks
   */
  setEventCallbacks(callbacks: {
    onConnectionOpen?: () => void;
    onConnectionClose?: () => void;
    onError?: (error: string) => void;
    onAudioChunk?: (chunk: TTSChunk) => void;
    onGenerationComplete?: (data: any) => void;
    onGenerationStarted?: (data: any) => void;
  }): void {
    this.onConnectionOpen = callbacks.onConnectionOpen;
    this.onConnectionClose = callbacks.onConnectionClose;
    this.onError = callbacks.onError;
    this.onAudioChunk = callbacks.onAudioChunk;
    this.onGenerationComplete = callbacks.onGenerationComplete;
    this.onGenerationStarted = callbacks.onGenerationStarted;
  }

  /**
   * Get connection status
   */
  isConnectedToTTS(): boolean {
    return this.isConnected;
  }

  /**
   * Get current queue length
   */
  getQueueLength(): number {
    return this.audioQueue.length;
  }

  /**
   * Check if currently playing audio
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlayingQueue || (this.currentAudioElement !== null && !this.currentAudioElement.paused);
  }
}

// Export singleton instance
export const ttsService = new TTSService();