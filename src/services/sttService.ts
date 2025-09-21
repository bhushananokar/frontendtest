// STT Service - Handle audio recording and speech-to-text conversion
export interface STTResponse {
  transcription: string;
  confidence?: number;
  timestamp?: string;
  filename?: string;
  error?: string;
}

export interface AudioRecordingState {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

class STTService {
  private readonly STT_ENDPOINT = 'https://mindspace-stt-222233295505.asia-south1.run.app/transcribe';
  private recordingStartTime: number = 0;
  private audioRecordingState: AudioRecordingState = {
    isRecording: false,
    mediaRecorder: null,
    audioChunks: []
  };

  /**
   * Initialize audio recording
   */
  async initializeRecording(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Common for STT services
        } 
      });
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    if (this.audioRecordingState.isRecording) {
      throw new Error('Recording is already in progress');
    }

    try {
      const stream = await this.initializeRecording();
      
      // Reset audio chunks
      this.audioRecordingState.audioChunks = [];
      
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.audioRecordingState.mediaRecorder = mediaRecorder;
      this.audioRecordingState.isRecording = true;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Audio chunk received:', event.data.size, 'bytes');
          this.audioRecordingState.audioChunks.push(event.data);
        } else {
          console.warn('Empty audio chunk received');
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every 1 second
      this.recordingStartTime = Date.now();
      
      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.audioRecordingState.isRecording = false;
      throw error;
    }
  }

  /**
   * Stop recording and return audio blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.audioRecordingState.isRecording || !this.audioRecordingState.mediaRecorder) {
        reject(new Error('No active recording to stop'));
        return;
      }

      const mediaRecorder = this.audioRecordingState.mediaRecorder;

      mediaRecorder.onstop = () => {
        try {
          // Stop all tracks
          const stream = mediaRecorder.stream;
          stream.getTracks().forEach(track => track.stop());

          // Create blob from recorded chunks
          const audioBlob = new Blob(this.audioRecordingState.audioChunks, {
            type: this.getSupportedMimeType()
          });

          // Reset state
          this.audioRecordingState.isRecording = false;
          this.audioRecordingState.mediaRecorder = null;
          this.audioRecordingState.audioChunks = [];

          console.log('Recording stopped, audio blob created:', audioBlob.size, 'bytes');
          console.log('Audio blob type:', audioBlob.type);
          console.log('Recording duration was approximately:', Date.now() - this.recordingStartTime, 'ms');
          
          // Log if audio blob is too small (might indicate no audio captured)
          if (audioBlob.size < 1000) {
            console.warn('Audio blob is very small:', audioBlob.size, 'bytes - this might indicate no audio was captured');
          }
          
          resolve(audioBlob);
        } catch (error) {
          console.error('Error creating audio blob:', error);
          reject(error);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        reject(new Error('Recording failed'));
      };

      // Stop recording
      mediaRecorder.stop();
    });
  }

  /**
   * Convert audio blob to text using STT API
   */
  async transcribeAudio(audioBlob: Blob): Promise<STTResponse> {
    try {
      console.log('Sending audio to STT service...', audioBlob.size, 'bytes');
      console.log('Audio blob type:', audioBlob.type);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Determine the appropriate filename based on the blob type
      let filename = 'recording.wav'; // Default to WAV
      if (audioBlob.type.includes('webm')) {
        filename = 'recording.webm';
      } else if (audioBlob.type.includes('mp4')) {
        filename = 'recording.mp4';
      } else if (audioBlob.type.includes('wav')) {
        filename = 'recording.wav';
      }
      
      console.log('Sending audio file as:', filename);
      formData.append('file', audioBlob, filename);

      const response = await fetch(this.STT_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      console.log('STT API response status:', response.status);
      
      if (!response.ok) {
        // Get more detailed error information
        const errorText = await response.text();
        console.error('STT API error details:', errorText);
        throw new Error(`STT API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('STT response received:', data);
      console.log('STT response type:', typeof data);
      console.log('STT response keys:', Object.keys(data));
      console.log('STT response structure:', JSON.stringify(data, null, 2));

      // Check if transcript field exists (based on API documentation)
      if (data.transcript !== undefined) {
        console.log('Found transcript field:', data.transcript);
        console.log('Transcript length:', data.transcript ? data.transcript.length : 0);
        console.log('Transcript after trim:', data.transcript ? data.transcript.trim() : '');
        console.log('Transcript after trim length:', data.transcript ? data.transcript.trim().length : 0);
        
        return {
          transcription: data.transcript,
          confidence: data.confidence,
          timestamp: data.timestamp,
          filename: data.filename
        };
      } 
      
      // Fallback to check other possible field names
      if (data.transcription || data.text) {
        console.log('Found alternative field:', data.transcription || data.text);
        return {
          transcription: data.transcription || data.text,
          confidence: data.confidence,
        };
      } 
      
      // Check for error field
      if (data.error) {
        console.log('Found error field:', data.error);
        return {
          transcription: '',
          error: data.error
        };
      } 
      
      // If none of the expected fields are found, log the issue
      console.error('Unexpected STT response format. Available fields:', Object.keys(data));
      console.error('Full response data:', data);
      throw new Error(`Unexpected STT response format. Available fields: ${Object.keys(data).join(', ')}`);
      

    } catch (error) {
      console.error('Error in transcribeAudio:', error);
      return {
        transcription: '',
        error: error instanceof Error ? error.message : 'Unknown STT error'
      };
    }
  }

  /**
   * Complete recording and transcription flow
   */
  async recordAndTranscribe(): Promise<STTResponse> {
    try {
      await this.startRecording();
      
      // Return a promise that will be resolved when stop is called
      return new Promise((resolve) => {
        // Store the resolve function to be called when recording stops
        (this as any)._recordingResolve = resolve;
      });
    } catch (error) {
      console.error('Error in recordAndTranscribe:', error);
      return {
        transcription: '',
        error: error instanceof Error ? error.message : 'Recording failed'
      };
    }
  }

  /**
   * Stop recording and get transcription
   */
  async stopRecordingAndTranscribe(): Promise<STTResponse> {
    try {
      const audioBlob = await this.stopRecording();
      const transcription = await this.transcribeAudio(audioBlob);
      
      // Resolve the pending promise if it exists
      if ((this as any)._recordingResolve) {
        (this as any)._recordingResolve(transcription);
        delete (this as any)._recordingResolve;
      }
      
      return transcription;
    } catch (error) {
      console.error('Error in stopRecordingAndTranscribe:', error);
      const errorResponse = {
        transcription: '',
        error: error instanceof Error ? error.message : 'Transcription failed'
      };
      
      // Resolve the pending promise with error if it exists
      if ((this as any)._recordingResolve) {
        (this as any)._recordingResolve(errorResponse);
        delete (this as any)._recordingResolve;
      }
      
      return errorResponse;
    }
  }

  /**
   * Get the best supported MIME type for recording
   */
  private getSupportedMimeType(): string {
    // Only use formats that the STT API supports:
    // ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm']
    const types = [
        'audio/wav',     // Best for STT APIs
        'audio/webm',    // Supported by STT API (check this BEFORE codecs version)
        'audio/ogg',     // Supported by STT API
        'audio/mpeg'     // Supported by STT API
        // Remove 'audio/webm;codecs=opus' entirely since it causes issues
];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('Using audio format:', type);
        return type;
      }
    }

    console.log('Falling back to audio/webm');
    return 'audio/webm'; // Safe fallback - supported by STT API
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.audioRecordingState.isRecording;
  }

  /**
   * Cancel current recording
   */
  cancelRecording(): void {
    if (this.audioRecordingState.mediaRecorder && this.audioRecordingState.isRecording) {
      this.audioRecordingState.mediaRecorder.stop();
      
      // Stop all tracks
      const stream = this.audioRecordingState.mediaRecorder.stream;
      stream.getTracks().forEach(track => track.stop());
      
      // Reset state
      this.audioRecordingState.isRecording = false;
      this.audioRecordingState.mediaRecorder = null;
      this.audioRecordingState.audioChunks = [];
      
      console.log('Recording cancelled');
    }
  }
}

// Export singleton instance
export const sttService = new STTService();