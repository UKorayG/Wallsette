"use client";
import { useState, useEffect, useCallback } from "react";

// Extended character set for more varied glitch effects
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?~';
const HEX_CHARS = '0123456789ABCDEF';
const BINARY = '01';
const LOREM_IPSUM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

interface GlitchProps {
  text: string;
  speed?: number;
  isRed?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  permanentGlitch?: boolean;
}

export default function GlitchText({ 
  text, 
  speed = 100, 
  isRed = false, 
  intensity = 'medium',
  permanentGlitch = false
}: GlitchProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(permanentGlitch);
  const [glitchVariant, setGlitchVariant] = useState(0);
  
  // Intensity settings
  const intensitySettings = {
    low: { chance: 0.3, maxGlitchLength: 3, maxIterations: 1 },
    medium: { chance: 0.5, maxGlitchLength: 5, maxIterations: 2 },
    high: { chance: 0.8, maxGlitchLength: 8, maxIterations: 3 }
  };
  
  const currentIntensity = intensitySettings[intensity];

  // Different types of glitch effects
  const glitchEffects = [
    // Random character replacement
    (str: string) => {
      const chars = str.split('');
      const glitchCount = Math.ceil(chars.length * 0.3);
      
      for (let i = 0; i < glitchCount; i++) {
        const pos = Math.floor(Math.random() * chars.length);
        chars[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      return chars.join('');
    },
    
    // Binary glitch
    (str: string) => {
      return str.split('').map((char, i) => {
        if (Math.random() > 0.7) {
          return BINARY[Math.floor(Math.random() * BINARY.length)];
        }
        return char;
      }).join('');
    },
    
    // Hex glitch
    (str: string) => {
      if (str.length > 3) {
        const start = Math.floor(Math.random() * (str.length - 3));
        const length = 2 + Math.floor(Math.random() * 4);
        const hex = Array.from({length}, () => 
          HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
        ).join('');
        return str.slice(0, start) + hex + str.slice(start + length);
      }
      return str;
    },
    
    // Lorem ipsum injection
    (str: string) => {
      if (str.length < 5) return str;
      const words = LOREM_IPSUM.split(' ');
      const word = words[Math.floor(Math.random() * words.length)];
      const pos = Math.floor(Math.random() * (str.length - 1)) + 1;
      return str.slice(0, pos) + ' ' + word + ' ' + str.slice(pos);
    },
    
    // Character shift
    (str: string) => {
      const chars = str.split('');
      for (let i = 0; i < chars.length - 1; i++) {
        if (Math.random() > 0.7) {
          [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
          i++; // Skip next to prevent chained swaps
        }
      }
      return chars.join('');
    }
  ];

  const glitch = useCallback(() => {
    if (isGlitching && !permanentGlitch) return;
    
    setIsGlitching(true);
    const originalText = text;
    
    // Random number of glitch iterations based on intensity
    const glitchIterations = 1 + Math.floor(Math.random() * currentIntensity.maxIterations);
    let currentIteration = 0;
    
    const applyGlitch = () => {
      if (currentIteration >= glitchIterations) {
        if (!permanentGlitch) {
          setDisplayText(originalText);
          setIsGlitching(false);
        }
        return;
      }
      
      // Apply a random glitch effect
      const effectIndex = Math.floor(Math.random() * glitchEffects.length);
      const glitchedText = glitchEffects[effectIndex](originalText);
      
      setDisplayText(glitchedText);
      currentIteration++;
      
      // Schedule next glitch
      setTimeout(applyGlitch, 30 + Math.random() * 70);
    };
    
    applyGlitch();
  }, [text, isGlitching, permanentGlitch, currentIntensity.maxIterations]);

  // Kritik durumda daha sık glitch efekti
  // More frequent glitching for red/critical text
  useEffect(() => {
    if (text === 'Loading...' || text === 'OFFLINE') return;
    
    // More frequent glitches for red text
    const baseSpeed = isRed ? speed * 0.5 : speed;
    
    const interval = setInterval(() => {
      const shouldGlitch = Math.random() > (isRed ? 0.3 : 0.7);
      if (shouldGlitch) {
        glitch();
      }
    }, baseSpeed);
    
    return () => clearInterval(interval);
  }, [text, speed, isRed, glitch]);

  // For permanent glitch, apply it once on mount and when text changes
  useEffect(() => {
    if (permanentGlitch) {
      glitch();
    }
  }, [text, permanentGlitch, glitch]);

  // Metin değiştiğinde glitch efekti uygula
  useEffect(() => {
    if (text !== displayText && !isGlitching) {
      const timeout = setTimeout(() => {
        if (Math.random() > 0.5) {
          glitch();
        } else {
          setDisplayText(text);
        }
      }, 50);
      
      return () => clearTimeout(timeout);
    }
  }, [text, displayText, isGlitching, glitch]);

  // More dramatic styling for glitching text
  const glitchStyle: React.CSSProperties = {
    textShadow: isGlitching 
      ? `0 0 5px ${isRed ? 'rgba(255, 0, 60, 0.8)' : 'rgba(0, 243, 255, 0.8)'},
         0 0 10px ${isRed ? 'rgba(255, 0, 60, 0.5)' : 'rgba(0, 243, 255, 0.5)'},
         0 0 20px ${isRed ? 'rgba(255, 0, 60, 0.3)' : 'rgba(0, 243, 255, 0.3)'}`
      : 'none',
    transform: isGlitching 
      ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`
      : 'none',
    display: 'inline-block',
    position: 'relative' as const,
    transition: 'all 0.1s ease-out'
  };

  return (
    <span 
      className={`inline-block ${isRed ? 'text-red-500' : 'text-cyan-400'} ${isGlitching ? 'opacity-90' : ''}`}
      style={glitchStyle}
    >
      {displayText}
    </span>
  );
}
