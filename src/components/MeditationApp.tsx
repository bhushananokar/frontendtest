import React, { useState, useEffect, useRef } from 'react';
import './MeditationApp.css';
import meditationFigure from '../assets/meditation/meditation-figure.png';
import backgroundAudio from '../assets/meditation/background-music.mp3';

// Types for better TypeScript safety
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleDelay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  speed: number;
  direction: number;
}

interface SessionHistory {
  date: string;
  duration: number;
  totalDuration: number;
}

type ViewState = 'landing' | 'transition' | 'meditation';
type ThemeType = 'galaxy' | 'forest' | 'ocean';

export const MeditationApp: React.FC = () => {
  // Page states
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(5); // minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('galaxy');
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  
  // Animation and audio refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Stars and particles state (for galaxy theme)
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Load session history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('meditationHistory');
      if (savedHistory) {
        setSessionHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading meditation history:', error);
    }
  }, []);

  // Generate cosmic elements for galaxy theme
  useEffect(() => {
    if (selectedTheme === 'galaxy') {
      generateCosmicElements();
    }
  }, [selectedTheme]);

  // Session timer
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSession();
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
  }, [isPlaying, timeRemaining]);

  const generateCosmicElements = () => {
    // Generate stars
    const starArray: Star[] = [];
    for (let i = 0; i < 200; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 2 + 0.5,
        twinkleDelay: Math.random() * 5
      });
    }
    setStars(starArray);

    // Generate particles
    const particleArray: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        hue: Math.random() * 360,
        speed: Math.random() * 1.5 + 0.3,
        direction: Math.random() * 360
      });
    }
    setParticles(particleArray);
  };

  // Meditation text chunks (5-6 words each)
  const meditationChunks = [
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
    "Within and around you"
  ];
  
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // Speech synthesis with error handling
  const playMockNarration = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    try {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      // Short delay to ensure clean speech synthesis
      setTimeout(() => {
        const speakText = () => {
          const utterance = new SpeechSynthesisUtterance(meditationChunks[currentChunkIndex]);
          utterance.rate = 0.5;
          utterance.pitch = 0.1;
          utterance.volume = 0.9;
          
          // Find a deep voice if available
          const voices = speechSynthesis.getVoices();
          const deepVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('alex') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('ryan')
          ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
          
          if (deepVoice) {
            utterance.voice = deepVoice;
          }
          
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
          };
          utterance.onerror = (e) => {
            console.error('Speech error:', e);
            setIsSpeaking(false);
          };
          
          speechSynthesis.speak(utterance);
        };
        
        // Wait for voices to load if needed
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.addEventListener('voiceschanged', speakText, { once: true });
        } else {
          speakText();
        }
      }, 100);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  // Cycle through meditation text chunks
  useEffect(() => {
    if (isPlaying && currentView === 'meditation') {
      // Start narration immediately for first chunk
      if (currentChunkIndex === 0) {
        setTimeout(() => playMockNarration(), 500);
      }
      
      const chunkInterval = setInterval(() => {
        setCurrentChunkIndex(prev => {
          const nextIndex = (prev + 1) % meditationChunks.length;
          return nextIndex;
        });
      }, 12000); // Change text every 12 seconds
      
      return () => clearInterval(chunkInterval);
    }
  }, [isPlaying, currentView]);

  // Separate effect for narration to avoid conflicts
  useEffect(() => {
    if (isPlaying && currentView === 'meditation' && currentChunkIndex > 0) {
      const timer = setTimeout(() => playMockNarration(), 300);
      return () => clearTimeout(timer);
    }
  }, [currentChunkIndex]);

  // Start meditation session
  const startMeditation = () => {
    setCurrentView('transition');
    setTimeRemaining(sessionDuration * 60); // Convert to seconds
    setCurrentChunkIndex(0);
    
    // Start background audio
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = 0.3;
      backgroundAudioRef.current.play().catch(e => console.log('Background audio autoplay blocked:', e));
    }
    
    // Trigger circular expansion animation
    setTimeout(() => {
      setCurrentView('meditation');
      setIsPlaying(true);
    }, 2000);
  };

  const pauseResume = () => {
    setIsPlaying(!isPlaying);
    
    // Handle background audio
    if (backgroundAudioRef.current) {
      if (isPlaying) {
        backgroundAudioRef.current.pause();
      } else {
        backgroundAudioRef.current.play().catch(e => console.log('Audio play error:', e));
      }
    }
    
    // Handle speech synthesis
    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      speechSynthesis.resume();
    }
  };

  const stopSession = () => {
    const completedDuration = Math.round((sessionDuration * 60 - timeRemaining) / 60);
    if (completedDuration > 0) {
      const newSession: SessionHistory = {
        date: new Date().toLocaleDateString(),
        duration: completedDuration,
        totalDuration: sessionDuration
      };
      const updatedHistory = [newSession, ...sessionHistory.slice(0, 9)]; // Keep last 10 sessions
      setSessionHistory(updatedHistory);
      localStorage.setItem('meditationHistory', JSON.stringify(updatedHistory));
    }
    
    // Stop background audio
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    
    // Stop speech synthesis
    speechSynthesis.cancel();
    setIsSpeaking(false);
    
    setCurrentView('landing');
    setIsPlaying(false);
    setTimeRemaining(0);
  };

  const endSession = () => {
    const newSession: SessionHistory = {
      date: new Date().toLocaleDateString(),
      duration: sessionDuration,
      totalDuration: sessionDuration
    };
    const updatedHistory = [newSession, ...sessionHistory.slice(0, 9)];
    setSessionHistory(updatedHistory);
    localStorage.setItem('meditationHistory', JSON.stringify(updatedHistory));
    
    // Stop background audio
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    
    // Stop speech synthesis
    speechSynthesis.cancel();
    setIsSpeaking(false);
    
    setCurrentView('landing');
    setIsPlaying(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Initialize background audio
  useEffect(() => {
    const audio = new Audio(backgroundAudio);
    backgroundAudioRef.current = audio;
    
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={`app-container ${currentView}`}>
      {/* Landing Page */}
      {currentView === 'landing' && (
        <div className="landing-page">
          <div className="landing-content">
            <div className="start-meditation-container">
              <button 
                className="start-meditation-btn"
                onClick={startMeditation}
                aria-label={`Start ${sessionDuration} minute meditation session`}
              >
                Start Meditation
              </button>
            </div>
            
            <div className="session-controls">
              <div className="duration-selector">
                <label htmlFor="duration-select">Session Duration:</label>
                <select 
                  id="duration-select"
                  value={sessionDuration} 
                  onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
              
              <button 
                className="customization-btn"
                onClick={() => setShowCustomization(!showCustomization)}
                aria-expanded={showCustomization}
              >
                Customize
              </button>
            </div>

            {showCustomization && (
              <div className="customization-panel">
                <div className="theme-selector">
                  <label>Background Theme:</label>
                  <div className="theme-options">
                    <button 
                      className={`theme-btn ${selectedTheme === 'galaxy' ? 'active' : ''}`}
                      onClick={() => setSelectedTheme('galaxy')}
                    >
                      Galaxy
                    </button>
                    <button 
                      className={`theme-btn ${selectedTheme === 'forest' ? 'active' : ''}`}
                      onClick={() => setSelectedTheme('forest')}
                    >
                      Forest
                    </button>
                    <button 
                      className={`theme-btn ${selectedTheme === 'ocean' ? 'active' : ''}`}
                      onClick={() => setSelectedTheme('ocean')}
                    >
                      Ocean
                    </button>
                  </div>
                </div>
              </div>
            )}

            {sessionHistory.length > 0 && (
              <div className="session-history">
                <h3>Previous Sessions</h3>
                <div className="history-list">
                  {sessionHistory.map((session, index) => (
                    <div key={index} className="history-item">
                      <span className="date">{session.date}</span>
                      <span className="duration">{session.duration} min</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transition Animation */}
      {currentView === 'transition' && (
        <div className="transition-container">
          <div className="burst-animation"></div>
        </div>
      )}

      {/* Meditation Session */}
      {currentView === 'meditation' && (
        <div className="meditation-container">
          {/* Background Theme */}
          <div className={`background-theme ${selectedTheme}`}>
            {selectedTheme === 'galaxy' && (
              <>
                <div className="nebula-background"></div>
                <div className="cosmic-overlay"></div>
                
                {/* Stars */}
                <div className="stars-container">
                  {stars.map((star) => (
                    <div
                      key={star.id}
                      className="star"
                      style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDelay: `${star.twinkleDelay}s`,
                        animationDuration: `${star.speed}s`
                      }}
                    />
                  ))}
                </div>

                {/* Particles */}
                <div className="particles-container">
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="particle"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: `hsl(${particle.hue}, 70%, 60%)`,
                        animationDuration: `${particle.speed * 10}s`,
                        animationDelay: `${particle.speed}s`
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Meditation Figure */}
          <div className="meditation-figure-container">
            {/* Responsive Orb Background */}
            <div className={`meditation-orb ${isSpeaking ? 'orb-active' : 'orb-idle'}`}>
              <div className="orb-layer orb-layer-1"></div>
              <div className="orb-layer orb-layer-2"></div>
              <div className="orb-layer orb-layer-3"></div>
            </div>
            
            <div className={`meditation-figure ${isPlaying ? 'playing' : ''}`}>
              <img
                src={meditationFigure}
                alt="Cosmic Meditation Figure"
                className="meditation-image"
              />
              <div className="figure-energy-flow"></div>
            </div>
          </div>

          {/* Meditation Text Box - Smaller and more centered */}
          <div className="meditation-text-container">
            <div className="glassmorphic-text-box">
              <p className="meditation-transcript">{meditationChunks[currentChunkIndex]}</p>
            </div>
          </div>

          {/* Timer Display - Positioned at Top */}
          <div className="timer-display">
            {formatTime(timeRemaining)}
          </div>

          {/* Session Controls - Play/Pause buttons only */}
          <div className="session-controls-bottom">
            <div className="control-buttons">
              <button 
                className={`control-btn pause-resume ${isPlaying ? 'pause' : 'resume'}`}
                onClick={pauseResume}
                aria-label={isPlaying ? 'Pause meditation' : 'Resume meditation'}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              
              <button 
                className="control-btn stop"
                onClick={stopSession}
                aria-label="Stop meditation session"
              >
                ⏹
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};