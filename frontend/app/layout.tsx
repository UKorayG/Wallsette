import type { Metadata } from "next";
import { VT323 } from 'next/font/google';
import "./globals.css";

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
      <body className="bg-black text-green-500">{children}</body>
    </html>
  );
}
