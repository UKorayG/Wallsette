"use client";
import { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import { Terminal, AlertTriangle, Play, Radio, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [balance, setBalance] = useState<string>("Initializing...");
  const [isCritical, setIsCritical] = useState(false);
  const [booted, setBooted] = useState(false);

  // 1. Boot Animasyonu
  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Veri Çekme Döngüsü
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/check');
        const data = await res.json();
        const val = data.value;
        setBalance(val);

        const numVal = parseInt(val);
        if (!isNaN(numVal) && numVal < 900000) {
          setIsCritical(true);
        } else {
          setIsCritical(false);
        }
      } catch (err) {
        setBalance("CONNECTION_LOST");
        setIsCritical(true);
      }
    };

    if (booted) {
        fetchData(); // İlk çekiş
        const interval = setInterval(fetchData, 1000); // Döngü
        return () => clearInterval(interval);
    }
  }, [booted]);

  return (
    <main className="min-h-screen bg-[#020202] text-[#00f3ff] font-vhs relative flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#ff003c] selection:text-black">
      
      {/* --- ATMOSFER KATMANI --- */}
      <div className="scanlines"></div>
      <div className="noise"></div>
      
      {/* Grid Arkaplan */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* --- ANA TERMİNAL KUTUSU --- */}
      <div className={`relative z-10 w-full max-w-3xl bg-black/90 border-2 ${isCritical ? 'border-[#ff003c] shadow-[0_0_50px_rgba(255,0,60,0.2)]' : 'border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.1)]'} p-6 md:p-10 transition-all duration-500`}>
        
        {/* Header Bar */}
        <div className="flex justify-between items-start border-b border-[#00f3ff]/20 pb-4 mb-8">
            <div>
                <h1 className="text-3xl md:text-5xl flex items-center gap-3 tracking-widest glitch-text">
                    <Terminal size={32} />
                    WALLSETTE_OS
                </h1>
                <div className="flex gap-4 mt-2 text-sm opacity-60 font-mono">
                    <span>&gt; KERNEL: V23.2</span>
                    <span>&gt; NET: TESTNET</span>
                </div>
            </div>
            
            {/* Status Badge */}
            <div className={`border px-3 py-1 flex items-center gap-2 text-sm font-bold tracking-widest ${isCritical ? 'border-[#ff003c] text-[#ff003c] bg-[#ff003c]/10 animate-pulse' : 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10'}`}>
                <Radio size={14} className={isCritical ? "animate-spin" : ""} />
                {isCritical ? "CRITICAL FAILURE" : "SYSTEM STABLE"}
            </div>
        </div>

        {/* EKRAN İÇERİĞİ */}
        <div className="min-h-[250px] flex flex-col items-center justify-center relative bg-[#050505] border border-[#00f3ff]/10 p-8 mb-8">
            
            {!booted ? (
                // Boot Ekranı (Düzeltilen Kısım Burası)
                <div className="text-left w-full space-y-2 text-lg font-mono">
                    <p className="text-white">&gt; INITIALIZING BIOS...</p>
                    <p className="text-white/80">&gt; LOADING MEMORY BLOCKS... [OK]</p>
                    <p className="text-white/60">&gt; ESTABLISHING RPC BRIDGE... [OK]</p>
                    <p className="text-[#00f3ff] animate-pulse">&gt; STARTING WALLSETTE DAEMON...</p>
                </div>
            ) : (
                // Bakiye Ekranı
                <>
                    <span className="absolute top-3 left-3 text-xs opacity-50 tracking-[0.2em]">CURRENT_ASSET_LIQUIDITY</span>
                    
                    <div className={`text-7xl md:text-9xl font-bold tracking-tighter filter drop-shadow-[0_0_10px_currentColor] ${isCritical ? 'text-[#ff003c] shake-hard' : 'text-[#00f3ff]'}`}>
                        <GlitchText 
                            text={balance} 
                            speed={50} 
                            isRed={isCritical} 
                            glitchProbability={isCritical ? 0.3 : 0.05} 
                        />
                    </div>

                    <div className="absolute bottom-3 right-3 text-xs opacity-60 flex items-center gap-2">
                         <span className="animate-pulse">●</span> LIVE DECAY: 0.1% / SEC
                    </div>
                </>
            )}
        </div>

        {/* FOOTER / KOMUTLAR */}
        {booted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-lg">
                <button className="group border border-[#00f3ff]/50 hover:bg-[#00f3ff] hover:text-black p-4 flex items-center justify-between transition-all">
                    <span className="flex items-center gap-2"><Play size={16} /> EXECUTE_TRANSFER.exe</span>
                    <span className="opacity-0 group-hover:opacity-100">&lt;&lt;</span>
                </button>

                {isCritical && (
                    <button className="group border border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c] hover:text-black p-4 flex items-center justify-between transition-all animate-pulse">
                        <span className="flex items-center gap-2"><ShieldAlert size={16} /> EMERGENCY_DUMP</span>
                        <span className="font-bold">!!!</span>
                    </button>
                )}
            </div>
        )}

      </div>

      <div className="fixed bottom-4 text-[10px] text-white/20 tracking-[0.5em]">
        SESSION ID: CCS...MK // ENCRYPTED
      </div>

    </main>
  );
}