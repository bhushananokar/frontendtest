// Therapist Service - Handle therapy session management and chat
export interface TherapistResponse {
  response: string;
  phase: string;
  phase_changed: boolean;
  conversation_count: number;
  detected_symptoms: string[];
  session_completed: boolean;
  crisis_alert?: string | null;
  error?: string;
}

export interface SessionInfo {
  session_id: number;
  patient_name: string;
  initial_message: string;
  phase: string;
}

export interface StartSessionRequest {
  patient_id: number;
}

export interface ChatRequest {
  message: string;
  session_id: number;
}

class TherapistService {
  private readonly BASE_URL = 'https://therapy.mymindspace.in';
  private currentSessionId: number | null = null;
  private conversationHistory: Array<{user: string, ai: string, timestamp: string}> = [];

  /**
   * Start a new therapy session
   */
  async startSession(patientId: number = 1): Promise<SessionInfo> {
    try {
      console.log('Starting therapy session for patient:', patientId);

      const response = await fetch(`${this.BASE_URL}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: patientId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.status} ${response.statusText}`);
      }

      const sessionInfo: SessionInfo = await response.json();
      
      this.currentSessionId = sessionInfo.session_id;
      this.conversationHistory = []; // Reset conversation history
      
      console.log('Therapy session started:', sessionInfo);
      
      return sessionInfo;
    } catch (error) {
      console.error('Error starting therapy session:', error);
      throw new Error(`Failed to start therapy session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send message to therapist and get response
   */
  async sendMessage(message: string, sessionId?: number): Promise<TherapistResponse> {
    try {
      const useSessionId = sessionId || this.currentSessionId;
      
      if (!useSessionId) {
        throw new Error('No active session. Please start a session first.');
      }

      console.log('Sending message to therapist:', message);

      const chatRequest: ChatRequest = {
        message: message,
        session_id: useSessionId
      };

      const response = await fetch(`${this.BASE_URL}/sessions/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
      }

      const therapistResponse: TherapistResponse = await response.json();
      
      // Store conversation in history
      this.conversationHistory.push({
        user: message,
        ai: therapistResponse.response,
        timestamp: new Date().toISOString()
      });

      console.log('Therapist response received:', therapistResponse);
      
      return therapistResponse;
    } catch (error) {
      console.error('Error sending message to therapist:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting right now. Could you please try again?",
        phase: 'error',
        phase_changed: false,
        conversation_count: 0,
        detected_symptoms: [],
        session_completed: false,
        error: error instanceof Error ? error.message : 'Unknown therapist error'
      };
    }
  }

  /**
   * Get current session details
   */
  async getSessionDetails(sessionId?: number): Promise<any> {
    try {
      const useSessionId = sessionId || this.currentSessionId;
      
      if (!useSessionId) {
        throw new Error('No active session to retrieve details for');
      }

      const response = await fetch(`${this.BASE_URL}/sessions/${useSessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get session details: ${response.status} ${response.statusText}`);
      }

      const sessionDetails = await response.json();
      console.log('Session details retrieved:', sessionDetails);
      
      return sessionDetails;
    } catch (error) {
      console.error('Error getting session details:', error);
      throw error;
    }
  }

  /**
   * Initialize session with default patient or create patient
   */
  async initializeSession(): Promise<SessionInfo> {
    try {
      // Try to start with default patient ID 1
      // If patient doesn't exist, create one first
      try {
        return await this.startSession(1);
      } catch (error) {
        console.log('Default patient not found, creating new patient...');
        
        // Create a new patient
        const patient = await this.createPatient('Anonymous User');
        return await this.startSession(patient.id);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      throw error;
    }
  }

  /**
   * Create a new patient
   */
  async createPatient(name: string): Promise<{id: number, name: string}> {
    try {
      const response = await fetch(`${this.BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create patient: ${response.status} ${response.statusText}`);
      }

      const patient = await response.json();
      console.log('Patient created:', patient);
      
      return patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): Array<{user: string, ai: string, timestamp: string}> {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): number | null {
    return this.currentSessionId;
  }

  /**
   * Check if session is active
   */
  hasActiveSession(): boolean {
    return this.currentSessionId !== null;
  }

  /**
   * End current session
   */
  endSession(): void {
    this.currentSessionId = null;
    this.conversationHistory = [];
    console.log('Therapy session ended');
  }

  /**
   * Health check for the therapist API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`, {
        method: 'GET',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Therapist API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const therapistService = new TherapistService();