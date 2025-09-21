Starting (3/6) *Study API documentation*

Let me read the STT documentation first to understand the complete flow. 

Read [](file:///c%3A/Users/Nishant%20Raj/Documents/Projects/MyMindSpace/Frontend/tempmymindspace/STT_readme.md)

Let me check if there's an STT readme file in the repository or get the STT endpoint documentation from the provided URL. 

Searched for files matching `**/*STT*`, 2 matches

Using "Fetch Web Page"

Fetched https://mindspace-tts-222233295505.asia-south1.run.app/docs

Let me proceed with the analysis based on the provided information and the detailed documentation for TTS and Therapist APIs. 

Completed (3/6) *Study API documentation*

## Integration Plan for Therapy Page

Based on my analysis of the current Therapy page and the API documentation, here's a comprehensive plan to integrate your STT, Therapist, and TTS services:

### Current State Analysis
The existing Therapy page uses:
- `webkitSpeechRecognition` for STT (browser API)
- `speechSynthesis` for TTS (browser API)  
- Random response generator for therapist responses
- Simple state management for listening/speaking states

### API Integration Plan

#### **Phase 1: Service Layer Architecture**
Create dedicated service files to handle each API:

1. **STT Service** (`src/services/sttService.ts`)
   - Handle audio recording from microphone
   - Convert audio to required format for STT API
   - POST to `https://mindspace-tts-222233295505.asia-south1.run.app/transcribe`
   - Process transcription response

2. **Therapist Service** (`src/services/therapistService.ts`)
   - Manage therapy session state
   - POST to `https://therapy.mymindspace.in/sessions/chat`
   - Handle session initialization and continuation
   - Process therapist responses

3. **TTS Service** (`src/services/ttsService.ts`)
   - WebSocket connection to `ws://ws.mymindspace.in/ws/tts`
   - Send text for conversion
   - Receive and queue audio chunks
   - Handle real-time audio playback

#### **Phase 2: Audio Management System**
1. **Audio Recording**
   - Replace `webkitSpeechRecognition` with `MediaRecorder` API
   - Capture audio in WAV/MP3 format for STT service
   - Handle recording start/stop states

2. **Audio Playback Queue**
   - Implement audio chunk queueing system
   - Handle sequential playback of TTS chunks as they arrive
   - Manage playback states and interruptions

#### **Phase 3: State Management Enhancement**
1. **Session Management**
   - Track therapy session ID
   - Maintain conversation history
   - Handle session phases (intake, assessment, therapy, etc.)

2. **Error Handling**
   - Network error recovery
   - Fallback mechanisms for each service
   - User feedback for connection issues

3. **UI State Updates**
   - Real-time status indicators
   - Progress feedback during audio processing
   - Visual feedback for each phase of the pipeline

#### **Phase 4: Complete Flow Integration**

**New Flow Architecture:**
```
User Speech → Audio Recording → STT API → Therapist API → TTS WebSocket → Audio Playback
```

**Detailed Flow:**
1. **User Input Phase**
   - User clicks microphone → Start recording
   - Record audio using MediaRecorder
   - Stop recording → Send to STT service
   - Display "Processing your speech..." status

2. **STT Processing**
   - Convert audio to required format
   - POST to STT endpoint with audio data
   - Receive transcribed text
   - Display "Understanding your message..." status

3. **Therapist Processing**
   - Send transcribed text to therapist API
   - Include session context if continuing conversation
   - Receive therapist response
   - Display "Dr. Mindy is thinking..." status

4. **TTS Processing**
   - Establish WebSocket connection to TTS service
   - Send therapist response text for conversion
   - Receive audio chunks in real-time
   - Queue and play audio chunks sequentially
   - Display "Dr. Mindy is speaking..." status

5. **Completion**
   - Return to ready state
   - Enable microphone for next input

#### **Phase 5: Enhanced Features**
1. **Conversation Persistence**
   - Store conversation history
   - Resume interrupted sessions
   - Track therapy progress

2. **Audio Quality Optimization**
   - Handle audio format conversions
   - Optimize chunk sizes for smooth playback
   - Implement audio preprocessing

3. **User Experience Improvements**
   - Visual waveform during recording
   - Typing indicators during processing
   - Interruption handling (stop current audio when user speaks)

#### **UI/UX Preservation & Enhancement Plan**
*Current beautiful design to maintain and enhance:*

1. **Preserve Existing Beautiful Elements**
   - Animated gradient background bars that change color based on state
   - Smooth state transitions and color schemes
   - Elegant text display with backdrop blur and glassmorphism
   - Professional button styling with hover effects
   - Status indicators with emojis and descriptive text

2. **State-Based Visual Feedback**
   - **Idle**: Default pink gradient (#e60a64) - "Ready to listen"
   - **Listening**: Blue gradient (#3B82F6, #1E40AF) - "🎤 Listening to you..."
   - **Processing Speech**: Orange/Yellow gradient - "⚡ Understanding your message..."
   - **Thinking**: Purple gradient (#8B5CF6, #7C3AED) - "🧠 Dr. Mindy is thinking..."
   - **Speaking**: Purple gradient (same) - "🗣️ Dr. Mindy is speaking..."
   - **Error**: Red gradient - "⚠️ Connection issue..."

3. **Enhanced Animations**
   - Pulse animation during processing phases
   - Smooth color transitions between states
   - Loading indicators for each processing stage
   - Subtle bounce effects for state changes

4. **Improved Status Display**
   - Real-time transcription preview
   - Processing progress indicators
   - Connection status for each service
   - Queue length display for TTS chunks

5. **Accessibility Improvements**
   - Visual feedback for audio cues
   - Keyboard navigation support
   - Clear error messages and recovery options
   - Screen reader friendly status updates

### Technical Considerations

#### **STT Integration**
- Audio format requirements (need to determine from API docs)
- File size limits and chunking if needed
- Real-time vs batch processing

#### **Therapist API Integration**
- Session initialization flow
- Context management across conversations
- Error handling for therapy session states

#### **TTS WebSocket Integration**
- Connection management and reconnection logic
- Real-time chunk streaming and queueing
- Voice selection (Fritz-PlayAI as default)
- Audio format handling (base64 decoded WAV)

#### **Performance Optimization**
- Parallel processing where possible
- Caching for repeated interactions
- Efficient state management
- Memory management for audio data

### Risk Mitigation
1. **Fallback Mechanisms**
   - Graceful degradation to browser APIs if services fail
   - Error messages with user guidance
   - Retry logic for network issues

2. **User Experience**
   - Clear status indicators for each processing phase
   - Ability to cancel/retry operations
   - Responsive feedback during processing

3. **Development Approach**
   - Incremental implementation and testing
   - Service isolation for easier debugging
   - Comprehensive error handling

Would you like me to proceed with implementing this plan? I can start with creating the service layer architecture and then move through each phase systematically. Please let me know if you'd like any modifications to this approach or if you have specific preferences for any particular phase.