import { useState, useEffect, useRef } from 'react'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Loader2
} from "lucide-react"
import { GradientBars } from '../components/bg-bars'
import { 
  therapyIntegrationService, 
  TherapyFlowState, 
  TherapyFlowCallbacks
} from '../services'

export const Therapy = () => {
  const [currentText, setCurrentText] = useState("Initializing Dr. Mindy...")
  const [therapyState, setTherapyState] = useState<TherapyFlowState>({
    phase: 'idle',
    isActive: false
  })
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastUserMessage, setLastUserMessage] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<{
    stt: boolean;
    therapist: boolean;
    tts: boolean;
  }>({ stt: true, therapist: false, tts: false })
  
  const initializationAttempted = useRef(false)

  // Initialize therapy service on component mount
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true
      initializeTherapyService()
    }

    // Cleanup on unmount
    return () => {
      therapyIntegrationService.shutdown()
    }
  }, [])

  // Set up therapy service callbacks
  useEffect(() => {
    const callbacks: TherapyFlowCallbacks = {
      onStateChange: (state) => {
        console.log('State changed:', state);
        setTherapyState(state)
        updateUIBasedOnState(state)
      },
      onUserTranscription: (transcription) => {
        console.log('User transcription:', transcription);
        setLastUserMessage(transcription)
        setCurrentText(`You said: "${transcription}"`)
      },
      onTherapistResponse: (response) => {
        console.log('Therapist response:', response);
        setCurrentText(response.response)
      },
      onAudioChunk: (chunk) => {
        // Audio chunks are automatically handled by the TTS service
        console.log(`Audio chunk ${chunk.chunk_id}/${chunk.total_chunks} received`)
      },
      onError: (error) => {
        console.error('Therapy flow error:', error);
        setCurrentText(`Error: ${error}`)
      },
      onComplete: () => {
        console.log('Therapy flow completed');
        // Reset to ready state after speaking completes
      }
    }

    therapyIntegrationService.setCallbacks(callbacks)
    console.log('Therapy service callbacks set');
  }, [])

  // Check service health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await therapyIntegrationService.healthCheck()
        setConnectionStatus(health)
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds
    checkHealth() // Initial check

    return () => clearInterval(interval)
  }, [])

  async function initializeTherapyService() {
    try {
      console.log('Starting therapy service initialization...');
      setCurrentText("Connecting to Dr. Mindy...")
      
      // Add step-by-step debugging
      console.log('Step 1: Calling therapyIntegrationService.initialize()...');
      await therapyIntegrationService.initialize()
      
      console.log('Step 2: Therapy service initialized successfully');
      setIsInitialized(true)
      
      console.log('Step 3: Initialization complete, isInitialized set to true');
    } catch (error) {
      console.error('Failed to initialize therapy service:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setCurrentText(`Failed to connect to Dr. Mindy: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh the page to try again.`)
    }
  }

  function updateUIBasedOnState(state: TherapyFlowState) {
    switch (state.phase) {
      case 'idle':
        if (state.sessionInfo?.initial_message) {
          setCurrentText(state.sessionInfo.initial_message)
        }
        break
      case 'listening':
        setCurrentText("I'm listening...")
        break
      case 'processing_speech':
        setCurrentText("Understanding your message...")
        break
      case 'thinking':
        setCurrentText("Let me think about that...")
        break
      case 'speaking':
        if (state.currentMessage) {
          setCurrentText(state.currentMessage)
        }
        break
      case 'error':
        setCurrentText(state.error || "Something went wrong. Please try again.")
        break
    }
  }

  async function handleMicrophoneClick() {
    if (!isInitialized) {
      setCurrentText("Service not ready. Please wait...")
      return
    }

    try {
      if (therapyState.phase === 'listening') {
        // Stop listening and process
        await therapyIntegrationService.stopListeningAndProcess()
      } else if (therapyState.phase === 'idle') {
        // Start listening
        await therapyIntegrationService.startTherapyFlow()
      } else {
        // Cancel current operation
        therapyIntegrationService.cancelCurrentOperation()
      }
    } catch (error) {
      console.error('Error in microphone interaction:', error)
      setCurrentText("Error with microphone. Please try again.")
    }
  }

  function handleVolumeToggle() {
    setSpeechEnabled(!speechEnabled)
    // Note: We might want to implement volume control in TTS service later
  }

  // Determine bar colors based on current state
  const getBarColors = () => {
    switch (therapyState.phase) {
      case 'listening':
        return ['#3B82F6', '#1E40AF', 'transparent'] // Blue gradient for user speaking
      case 'processing_speech':
        return ['#F59E0B', '#D97706', 'transparent'] // Orange gradient for processing
      case 'thinking':
      case 'speaking':
        return ['#8B5CF6', '#7C3AED', 'transparent'] // Purple gradient for therapist
      case 'error':
        return ['#EF4444', '#DC2626', 'transparent'] // Red gradient for errors
      default:
        return ['#e60a64', 'transparent'] // Default pink gradient for idle
    }
  }

  // Get appropriate status text and emoji
  const getStatusDisplay = () => {
    switch (therapyState.phase) {
      case 'listening':
        return '🎤 Listening to you...'
      case 'processing_speech':
        return '⚡ Understanding your message...'
      case 'thinking':
        return '🧠 Dr. Mindy is thinking...'
      case 'speaking':
        return '🗣️ Dr. Mindy is speaking...'
      case 'error':
        return '⚠️ Connection issue...'
      default:
        return isInitialized ? '💬 Ready to listen' : '🔄 Connecting...'
    }
  }

  // Determine if microphone should be disabled
  const isMicDisabled = () => {
    return !isInitialized || therapyState.phase === 'processing_speech' || therapyState.phase === 'thinking'
  }

  // Get microphone button appearance
  const getMicButtonStyle = () => {
    const isListening = therapyState.phase === 'listening'
    const isDisabled = isMicDisabled()

    return {
      backgroundColor: isListening ? '#ef4444' : 'rgba(139, 92, 246, 0.15)',
      border: '3px solid rgba(139, 92, 246, 0.4)',
      color: isListening ? 'white' : '#8B5CF6',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
    }
  }

  // Show loading spinner for processing states
  const showLoadingSpinner = () => {
    return ['processing_speech', 'thinking'].includes(therapyState.phase)
  }

  return (
    <div style={{ 
      position: 'relative',
      height: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      {/* Animated Background Bars */}
      <GradientBars 
        bars={20} 
        colors={getBarColors()}
      />
      
      {/* Centered Content */}
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
        color: '#374151',
        width: '90%'
      }}>
        {/* Main Text Display */}
        <div style={{
          fontSize: '28px',
          fontWeight: '300',
          lineHeight: '1.6',
          marginBottom: '40px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {currentText}
        </div>

        {/* Status Indicator */}
        <div style={{
          fontSize: '18px',
          fontWeight: '400',
          marginBottom: '30px',
          opacity: 0.9,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '20px',
          padding: '10px 20px',
          display: 'inline-block'
        }}>
          {getStatusDisplay()}
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          {/* Microphone Button */}
          <button
            onClick={handleMicrophoneClick}
            disabled={isMicDisabled()}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
              fontSize: '24px',
              position: 'relative',
              ...getMicButtonStyle()
            }}
          >
            {showLoadingSpinner() ? (
              <Loader2 size={32} className="animate-spin" />
            ) : therapyState.phase === 'listening' ? (
              <MicOff size={32} />
            ) : (
              <Mic size={32} />
            )}
          </button>

          {/* Voice Toggle Button */}
          <button
            onClick={handleVolumeToggle}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: speechEnabled ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.05)',
              border: '3px solid rgba(139, 92, 246, 0.4)',
              color: '#8B5CF6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
              opacity: speechEnabled ? 1 : 0.6
            }}
          >
            {speechEnabled ? <Volume2 size={32} /> : <VolumeX size={32} />}
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          fontSize: '16px',
          opacity: 0.8,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '15px 25px',
          display: 'inline-block',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)'
        }}>
          {isInitialized 
            ? "Click the microphone to start speaking with Dr. Mindy"
            : "Connecting to Dr. Mindy..."
          }
        </div>

        {/* Connection Status (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '20px',
            fontSize: '12px',
            opacity: 0.7,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: '10px',
            display: 'inline-block'
          }}>
            STT: {connectionStatus.stt ? '✅' : '❌'} | 
            Therapist: {connectionStatus.therapist ? '✅' : '❌'} | 
            TTS: {connectionStatus.tts ? '✅' : '❌'}
            {lastUserMessage && (
              <div>Last: "{lastUserMessage}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
