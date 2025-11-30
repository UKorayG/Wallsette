'use client';

import { useState } from 'react';

const slides = [
  {
    title: "Introduction to Wallsette",
    content: "Welcome to Wallsette - The Next Generation Asset Decay Protocol"
  },
  {
    title: "Problem Statement",
    content: "Current DeFi ecosystems lack sustainable tokenomics and long-term value retention mechanisms"
  },
  {
    title: "Our Solution",
    content: "Wallsette introduces a novel asset decay mechanism that ensures sustainable growth"
  },
  {
    title: "Key Features",
    content: "• Dynamic Decay Algorithm\n• Community Governance\n• Transparent Operations\n• Cross-chain Compatibility"
  },
  {
    title: "Technology Stack",
    content: "• Built on Stellar Network\n• Smart Contracts in Rust\n• Next.js Frontend\n• Secure Wallet Integration"
  },
  {
    title: "Use Cases",
    content: "• Decentralized Finance (DeFi)\n• NFT Platforms\n• Gaming Economies\n• DAO Treasuries"
  },
  {
    title: "Roadmap",
    content: "• Q1 2024: Testnet Launch\n• Q2 2024: Mainnet Release\n• Q3 2024: Cross-chain Integration\n• Q4 2024: Ecosystem Expansion"
  },
  {
    title: "Get Started",
    content: "Join our community and be part of the future of sustainable DeFi"
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-black/70 p-8 rounded-lg shadow-2xl border border-cyan-500/30">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl text-cyan-200 whitespace-pre-line">
          {slides[currentSlide].content}
        </p>
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-2 rounded ${currentSlide === 0 ? 'bg-gray-700 text-gray-500' : 'bg-cyan-800 hover:bg-cyan-700 text-cyan-200'}`}
          >
            Previous
          </button>
          <div className="text-cyan-400">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`px-6 py-2 rounded ${currentSlide === slides.length - 1 ? 'bg-gray-700 text-gray-500' : 'bg-cyan-800 hover:bg-cyan-700 text-cyan-200'}`}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-cyan-400' : 'bg-gray-600'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
