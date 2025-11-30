"use client";
import { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import { Terminal, AlertTriangle, Play, Radio, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [balance, setBalance] = useState<string>("Initializing...");
  const [isCritical, setIsCritical] = useState(false);
  const [booted, setBooted] = useState(false);

  // 1. Boot Animation
  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Data Fetching
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
      } catch (error) {
        console.error('Error fetching data:', error);
        setBalance("Error");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!booted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">SYSTEM BOOTING</div>
          <div className="animate-pulse">_</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-[#00f3ff] font-vhs relative flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#ff003c] selection:text-black">
      
      {/* --- ATMOSFER KATMANI --- */}
      <div className="scanlines"></div>
      <div className="noise"></div>
      
      {/* Grid Arkaplan */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* --- ANA TERMİNAL KUTUSU --- */}
      <div className="relative z-10">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6 bg-black/70 backdrop-blur-sm rounded-lg border border-[#00f3ff33]">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-6 p-3 bg-[#0a0a0a] rounded border border-[#00f3ff22]">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>STATUS: {isCritical ? 'CRITICAL' : 'NOMINAL'}</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">BALANCE</div>
              <div className="font-mono text-xl">{balance} WALLET</div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Panel */}
            <div className="md:col-span-2 space-y-6">
              {/* Terminal */}
              <div className="bg-[#0a0a0a] p-4 rounded border border-[#00f3ff22]">
                <div className="flex items-center mb-3">
                  <Terminal className="text-[#00f3ff] mr-2" />
                  <h2 className="text-lg">TERMINAL</h2>
                </div>
                <div className="h-40 overflow-y-auto font-mono text-sm bg-black p-3 rounded">
                  <p className="text-green-400">$ wallsette-cli --status</p>
                  <p>Initializing system...</p>
                  <p>Checking connections... <span className="text-green-400">OK</span></p>
                  <p>Loading modules... <span className="text-green-400">DONE</span></p>
                  <p className="mt-2">System ready.</p>
                  <p className="text-yellow-400">$ _</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-[#00f3ff11] hover:bg-[#00f3ff22] rounded border border-[#00f3ff33] transition-colors flex flex-col items-center justify-center">
                  <Play className="w-8 h-8 mb-2" />
                  <span>START NODE</span>
                </button>
                <button className="p-4 bg-[#00f3ff11] hover:bg-[#00f3ff22] rounded border border-[#00f3ff33] transition-colors flex flex-col items-center justify-center">
                  <Radio className="w-8 h-8 mb-2" />
                  <span>CONNECT</span>
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-[#0a0a0a] p-4 rounded border border-[#00f3ff22]">
                <h2 className="text-lg mb-3">SYSTEM STATUS</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>CPU:</span>
                    <span className="text-green-400">34%</span>
                  </div>
                  <div className="h-2 bg-[#003333] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00f3ff]" style={{ width: '34%' }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>MEMORY:</span>
                    <span className="text-green-400">56%</span>
                  </div>
                  <div className="h-2 bg-[#003333] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00f3ff]" style={{ width: '56%' }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>STORAGE:</span>
                    <span className="text-green-400">12%</span>
                  </div>
                  <div className="h-2 bg-[#003333] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00f3ff]" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-[#0a0a0a] p-4 rounded border border-[#00f3ff22]">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="text-yellow-500 mr-2" />
                  <h2 className="text-lg">ALERTS</h2>
                </div>
                {isCritical ? (
                  <div className="text-red-400 text-sm flex items-start">
                    <ShieldAlert className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>WARNING: Low balance detected. Please add more funds to your wallet.</span>
                  </div>
                ) : (
                  <div className="text-green-400 text-sm">
                    No critical issues detected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-4 text-[10px] text-white/20 tracking-[0.5em]">
        SESSION ID: CCS...MK // ENCRYPTED
      </div>

    </main>
  );
}