"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface GlitchProps {
  text: string;
  speed?: number;
  glitchProbability?: number;
  isRed?: boolean;
}

export default function GlitchText({ text, speed = 50, glitchProbability = 0.1, isRed = false }: GlitchProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const scramble = () => {
      let newText = "";
      for (let i = 0; i < text.length; i++) {
        if (Math.random() > glitchProbability || text[i] === " " || text[i] === ".") {
          newText += text[i];
        } else {
          newText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(newText);
    };
    interval = setInterval(scramble, speed);
    return () => clearInterval(interval);
  }, [text, speed, glitchProbability]);

  return (
    <motion.span
      animate={isRed ? { x: [-1, 1, -1, 0], opacity: [1, 0.8, 1] } : {}}
      transition={{ duration: 0.2, repeat: Infinity }}
      className={isRed ? "text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" : "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]"}
    >
      {displayText}
    </motion.span>
  );
}
