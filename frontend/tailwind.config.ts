import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        vhs: ['"VT323"', 'monospace'],
        mono: ['"VT323"', 'monospace'],
      },
      colors: {
        'neon-red': '#ff003c',
        'neon-blue': '#00f7ff',
        'neon-green': '#00ff00',
        'dark-bg': '#0a0a0a',
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'flicker': 'flicker 5s linear infinite',
        'scanline': 'scanline 5s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { textShadow: '0.05em 0 0 #ff00c1, -0.03em -0.04em 0 #00b7ff' },
          '15%': { textShadow: '0.05em 0 0 #ff00c1, -0.03em -0.04em 0 #00b7ff' },
          '16%': { textShadow: '-0.05em -0.03em 0 #ff00c1, 0.03em 0.04em 0 #00b7ff' },
          '49%': { textShadow: '-0.05em -0.03em 0 #ff00c1, 0.03em 0.04em 0 #00b7ff' },
          '50%': { textShadow: '0.05em 0.03em 0 #ff00c1, 0.03em 0.04em 0 #00b7ff' },
          '99%': { textShadow: '0.05em 0.03em 0 #ff00c1, 0.03em 0.04em 0 #00b7ff' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.9' },
          '1%, 3%, 5%, 7%, 9%': { opacity: '0.8' },
          '2%, 4%, 6%, 8%, 10%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
