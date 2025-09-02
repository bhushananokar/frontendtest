import { useState, useEffect, useRef } from 'react'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX
} from "lucide-react"
import { GradientBars } from './bg-bars'

export const Therapy = () => {
  const [currentText, setCurrentText] = useState("Hello! I'm Mindy, your AI therapist. I'm here to listen, support, and help you work through whatever is on your mind. How are you feeling today?")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [inputText, setInputText] = useState('')
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
        
        // Process user input and generate response
        setTimeout(() => {
          const response = generateTherapistResponse()
          setCurrentText(response)
          speakText(response)
        }, 1000)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setCurrentText("I'm listening...")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current && speechEnabled) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const generateTherapistResponse = (): string => {
    const responses = [
      "I hear you saying that. Can you tell me more about how that makes you feel?",
      "That sounds challenging. What thoughts go through your mind when that happens?",
      "Thank you for sharing that with me. How long have you been experiencing this?",
      "I can understand why that would be difficult. What support systems do you have in place?",
      "That's a very valid concern. What would you like to see change in this situation?",
      "It takes courage to talk about these things. What do you think might help you move forward?",
      "I'm here to listen. What else would you like to explore about this topic?",
      "That's an important insight. How do you think we can work together on this?"
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Determine bar colors based on current state
  const getBarColors = () => {
    if (isListening) {
      return ['#3B82F6', '#1E40AF', 'transparent'] // Blue gradient for user speaking
    } else if (isSpeaking) {
      return ['#8B5CF6', '#7C3AED', 'transparent'] // Purple gradient for therapist speaking
    } else {
      return ['#e60a64', 'transparent'] // Default pink gradient for idle
    }
  }

  return (
    <div style={{ 
      position: 'relative',
      height: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a'
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
        color: 'white',
        width: '90%'
      }}>
        {/* Main Text Display */}
        <div style={{
          fontSize: '28px',
          fontWeight: '300',
          lineHeight: '1.6',
          marginBottom: '40px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
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
          {isListening ? '🎤 Listening to you...' : 
           isSpeaking ? '🗣️ Mindy is speaking...' : 
           '💬 Ready to listen'}
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
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
              color: 'white',
              cursor: isSpeaking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSpeaking ? 0.5 : 1,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              fontSize: '24px'
            }}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          {/* Voice Toggle Button */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: speechEnabled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '20px',
          padding: '15px 25px',
          display: 'inline-block'
        }}>
          Click the microphone to start speaking with Mindy
        </div>
      </div>
    </div>
  )
}
