import type { Metadata } from "next";
import { VT323 } from 'next/font/google';
import "./globals.css";
import MenuBar from "../components/MenuBar";

// Load VT323 font
const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: "Wallsette",
  description: "Asset Decay Protocol - Mr. Robot Edition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vt323.variable} font-mono`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="text-[#00f3ff] min-h-screen flex flex-col">
        {/* Extra Large Logo */}
        <div className="fixed top-4 left-12 z-20">
          <img 
            src="/logo.png" 
            alt="Wallsette Logo"
            className="h-32 w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(0, 243, 255, 0.6))',
              transform: 'scale(1.3)'
            }}
          />
        </div>

        {/* Yerel GIF Arka Plan */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'url(\'/wst.gif\')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'none'
            }}
          />
        </div>
        
        {/* Logo */}
        <div className="fixed top-4 right-4 z-20">
          <img 
            src="/logo.gif" 
            alt="Wallsette Logo" 
            className="h-16 w-auto border-2 border-cyan-500/50 rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex flex-1">
          <MenuBar />
          <main className="flex-1 overflow-auto p-4 relative bg-black/10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
