'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Code, Cpu, Settings, Menu, X } from 'lucide-react';

export default function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Terminal', icon: <Terminal size={20} />, path: '/' },
    { name: 'Code', icon: <Code size={20} />, path: '/code' },
    { name: 'System', icon: <Cpu size={20} />, path: '/system' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = document.querySelector('nav');
      const menuButton = document.querySelector('button[aria-label="Toggle menu"]');
      
      if (isOpen && menu && !menu.contains(target) && menuButton && !menuButton.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Add Mr. Robot style glitch effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glitchElements = document.querySelectorAll('.glitch-effect');
      glitchElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only apply effect when mouse is near the element
        if (x > -50 && x < rect.width + 50 && y > -50 && y < rect.height + 50) {
          (el as HTMLElement).style.setProperty('--x', `${x}px`);
          (el as HTMLElement).style.setProperty('--y', `${y}px`);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-md text-[#00f3ff] hover:bg-[#00f3ff22] transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu sidebar */}
      <nav 
        className={`fixed top-0 right-0 h-full w-64 bg-[#0a0a0a] border-l border-[#00f3ff33] transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-40 p-4 md:translate-x-0 md:relative md:w-20 md:border-r md:border-l-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  pathname === item.path 
                    ? 'bg-[#00f3ff22] text-[#00f3ff]' 
                    : 'text-[#00f3ffaa] hover:bg-[#00f3ff11]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="md:hidden">{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Version number */}
          <div className="p-4 border-t border-[#00f3ff11] text-center text-xs text-gray-500">
            v1.0.0
          </div>
        </div>
      </nav>

      {/* Glitch effect styles */}
      <style jsx global>{`
        .glitch-effect {
          position: relative;
          overflow: hidden;
        }
        .glitch-effect::before,
        .glitch-effect::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(calc(var(--x, 0) * 0.01), calc(var(--y, 0) * 0.01));
          opacity: 0.7;
          pointer-events: none;
          transition: transform 0.1s ease-out;
        }
        .glitch-effect::before {
          color: #00f3ff;
          z-index: -2;
        }
        .glitch-effect::after {
          color: #ff003c;
          z-index: -1;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
        }
        .glitch-effect:hover::before,
        .glitch-effect:hover::after {
          transform: translate(0, 0);
          opacity: 0;
        }
      `}</style>
    </>
  );
}
