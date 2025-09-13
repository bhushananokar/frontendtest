import { useState, useEffect, useCallback } from 'react';

// Types for theme management
export type MeditationTheme = 'galaxy' | 'forest' | 'ocean';

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleDelay: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  speed: number;
  direction: number;
}

export interface ThemeState {
  currentTheme: MeditationTheme;
  stars: Star[];
  particles: Particle[];
  isAnimating: boolean;
}

interface ThemeConfig {
  starCount: number;
  particleCount: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  backgroundGradient: string;
}

// Theme configurations
const THEME_CONFIGS: Record<MeditationTheme, ThemeConfig> = {
  galaxy: {
    starCount: 200,
    particleCount: 50,
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#0f3460',
    },
    backgroundGradient: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  forest: {
    starCount: 100,
    particleCount: 30,
    colors: {
      primary: '#0d4f3c',
      secondary: '#1a5c4a',
      accent: '#2d7a5f',
    },
    backgroundGradient: 'radial-gradient(ellipse at center, #0d4f3c 0%, #1a5c4a 50%, #2d7a5f 100%)',
  },
  ocean: {
    starCount: 150,
    particleCount: 40,
    colors: {
      primary: '#0a2e5c',
      secondary: '#1e3a6f',
      accent: '#2d4f7a',
    },
    backgroundGradient: 'radial-gradient(ellipse at center, #0a2e5c 0%, #1e3a6f 50%, #2d4f7a 100%)',
  },
};

/**
 * Custom hook for managing meditation theme state and animations
 * Handles cosmic elements generation and theme switching
 */
export const useMeditationTheme = (initialTheme: MeditationTheme = 'galaxy') => {
  const [themeState, setThemeState] = useState<ThemeState>({
    currentTheme: initialTheme,
    stars: [],
    particles: [],
    isAnimating: false,
  });

  // Generate stars for the current theme
  const generateStars = useCallback((theme: MeditationTheme): Star[] => {
    const config = THEME_CONFIGS[theme];
    const stars: Star[] = [];

    for (let i = 0; i < config.starCount; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 2 + 0.5,
        twinkleDelay: Math.random() * 5,
      });
    }

    return stars;
  }, []);

  // Generate particles for the current theme
  const generateParticles = useCallback((theme: MeditationTheme): Particle[] => {
    const config = THEME_CONFIGS[theme];
    const particles: Particle[] = [];

    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        hue: theme === 'galaxy' ? Math.random() * 360 : 
             theme === 'forest' ? 120 + Math.random() * 60 : // Green range
             200 + Math.random() * 60, // Blue range
        speed: Math.random() * 1.5 + 0.3,
        direction: Math.random() * 360,
      });
    }

    return particles;
  }, []);

  // Generate cosmic elements for the current theme
  const generateCosmicElements = useCallback((theme: MeditationTheme) => {
    setThemeState(prev => ({
      ...prev,
      stars: generateStars(theme),
      particles: generateParticles(theme),
      isAnimating: true,
    }));
  }, [generateStars, generateParticles]);

  // Change theme
  const changeTheme = useCallback((newTheme: MeditationTheme) => {
    if (newTheme === themeState.currentTheme) return;

    setThemeState(prev => ({
      ...prev,
      currentTheme: newTheme,
      isAnimating: false,
    }));

    // Generate new cosmic elements after a brief delay for smooth transition
    setTimeout(() => {
      generateCosmicElements(newTheme);
    }, 100);
  }, [themeState.currentTheme, generateCosmicElements]);

  // Get current theme configuration
  const getCurrentThemeConfig = useCallback((): ThemeConfig => {
    return THEME_CONFIGS[themeState.currentTheme];
  }, [themeState.currentTheme]);

  // Get CSS variables for current theme
  const getThemeCSSVariables = useCallback(() => {
    const config = getCurrentThemeConfig();
    return {
      '--theme-primary': config.colors.primary,
      '--theme-secondary': config.colors.secondary,
      '--theme-accent': config.colors.accent,
      '--theme-background': config.backgroundGradient,
    };
  }, [getCurrentThemeConfig]);

  // Initialize cosmic elements on mount or theme change
  useEffect(() => {
    generateCosmicElements(themeState.currentTheme);
  }, [themeState.currentTheme, generateCosmicElements]);

  // Animation cleanup
  const stopAnimation = useCallback(() => {
    setThemeState(prev => ({
      ...prev,
      isAnimating: false,
    }));
  }, []);

  // Start animation
  const startAnimation = useCallback(() => {
    setThemeState(prev => ({
      ...prev,
      isAnimating: true,
    }));
  }, []);

  // Get theme-specific orb colors for meditation figure
  const getOrbColors = useCallback(() => {
    switch (themeState.currentTheme) {
      case 'galaxy':
        return {
          inner: 'rgba(138, 43, 226, 0.8)',
          middle: 'rgba(75, 0, 130, 0.6)',
          outer: 'rgba(25, 25, 112, 0.4)',
        };
      case 'forest':
        return {
          inner: 'rgba(34, 139, 34, 0.8)',
          middle: 'rgba(0, 100, 0, 0.6)',
          outer: 'rgba(0, 50, 0, 0.4)',
        };
      case 'ocean':
        return {
          inner: 'rgba(0, 119, 190, 0.8)',
          middle: 'rgba(0, 90, 150, 0.6)',
          outer: 'rgba(0, 60, 120, 0.4)',
        };
      default:
        return {
          inner: 'rgba(138, 43, 226, 0.8)',
          middle: 'rgba(75, 0, 130, 0.6)',
          outer: 'rgba(25, 25, 112, 0.4)',
        };
    }
  }, [themeState.currentTheme]);

  return {
    // State
    themeState,
    
    // Actions
    changeTheme,
    generateCosmicElements,
    startAnimation,
    stopAnimation,
    
    // Computed values
    getCurrentThemeConfig,
    getThemeCSSVariables,
    getOrbColors,
    
    // Theme configs for UI
    availableThemes: Object.keys(THEME_CONFIGS) as MeditationTheme[],
  };
};