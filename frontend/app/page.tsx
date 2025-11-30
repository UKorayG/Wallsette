"use client";
import { useState, useEffect, useCallback } from 'react';
import GlitchText from '../components/GlitchText';
import TransferForm from '../components/TransferForm';
import { Terminal, AlertTriangle, Play, Radio, ShieldAlert, Check, X } from 'lucide-react';

export default function Home() {
  const [balance, setBalance] = useState<string>("Initializing...");
  const [isCritical, setIsCritical] = useState(false);
  const [booted, setBooted] = useState(false);
  const [isNodeRunning, setIsNodeRunning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing system...',
    'Checking connections... OK',
    'Loading modules... DONE',
    'System ready.'
  ]);

  // 1. Boot Animation
  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Utility function to add logs to terminal
  const addTerminalLog = useCallback((message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = isError 
      ? `[${timestamp}] ERROR: ${message}`
      : `[${timestamp}] ${message}`;
      
    setTerminalLogs(prev => [...prev, logMessage].slice(-50)); // Keep last 50 logs
  }, []);

  // Node control function
  const toggleNode = useCallback(async () => {
    if (isNodeRunning) {
      // Stop node
      setIsNodeRunning(false);
      addTerminalLog('Stopping node...');
      // Simulate node stopping
      await new Promise(resolve => setTimeout(resolve, 1000));
      addTerminalLog('Node stopped.');
    } else {
      // Start node
      setIsNodeRunning(true);
      addTerminalLog('Starting node...');
      // Simulate node starting
      await new Promise(resolve => setTimeout(resolve, 2000));
      addTerminalLog('Node started successfully.');
      addTerminalLog('Synchronizing with network...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addTerminalLog('Node synchronized and ready.');
    }
  }, [isNodeRunning, addTerminalLog]);

  // Wallet connection function
  const connectWallet = useCallback(async () => {
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setWalletAddress(null);
      addTerminalLog('Wallet disconnected.');
    } else {
      // Connect
      setIsConnecting(true);
      addTerminalLog('Connecting wallet...');
      
      try {
        // Simulate wallet connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would connect to the user's wallet here
        const mockAddress = 'GCSXUXZSA2BVUCTVYK446DSPZOO3JHVCDCK36FALHZKLFOKRJWIS3AYI';
        
        setWalletAddress(mockAddress);
        setIsConnected(true);
        addTerminalLog(`Wallet connected: ${mockAddress.substring(0, 6)}...${mockAddress.substring(50)}`);
      } catch (error) {
        console.error('Wallet connection error:', error);
        addTerminalLog('Failed to connect wallet.', true);
      } finally {
        setIsConnecting(false);
      }
    }
  }, [isConnected, addTerminalLog]);

  // 2. Data Fetching
  const fetchBalance = async () => {
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

  // Handle token transfer
  const handleTransfer = async (toAddress: string, amount: string) => {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: toAddress, amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transfer failed');
    }

    // Refresh balance after successful transfer
    await fetchBalance();
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
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
              {isNodeRunning && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded">
                  NODE RUNNING
                </span>
              )}
              {isConnected && walletAddress && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded">
                  CONNECTED: {walletAddress.substring(0, 4)}...{walletAddress.slice(-4)}
                </span>
              )}
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
                  {terminalLogs.map((log, index) => (
                    <p 
                      key={index} 
                      className={log.includes('ERROR') ? 'text-red-400' : ''}
                    >
                      {log}
                    </p>
                  ))}
                  <p className="text-yellow-400">$ _</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  className={`p-4 rounded border transition-colors flex flex-col items-center justify-center ${
                    isNodeRunning
                      ? 'bg-red-900/30 border-red-500/50 hover:bg-red-900/40'
                      : 'bg-[#00f3ff11] border-[#00f3ff33] hover:bg-[#00f3ff22]'
                  }`}
                  onClick={toggleNode}
                  disabled={isConnecting}
                >
                  {isNodeRunning ? (
                    <>
                      <X className="w-8 h-8 mb-2 text-red-500" />
                      <span>STOP NODE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-8 h-8 mb-2 text-[#00f3ff]" />
                      <span>START NODE</span>
                    </>
                  )}
                </button>
                <button 
                  className={`p-4 rounded border transition-colors flex flex-col items-center justify-center ${
                    isConnected
                      ? 'bg-green-900/30 border-green-500/50 hover:bg-green-900/40'
                      : 'bg-[#00f3ff11] border-[#00f3ff33] hover:bg-[#00f3ff22]'
                  }`}
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnected ? (
                    <>
                      <Check className="w-8 h-8 mb-2 text-green-500" />
                      <span>CONNECTED</span>
                      {walletAddress && (
                        <span className="text-xs mt-1 opacity-70">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(50)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <Radio className={`w-8 h-8 mb-2 ${isConnecting ? 'animate-pulse' : ''}`} />
                      <span>{isConnecting ? 'CONNECTING...' : 'CONNECT'}</span>
                    </>
                  )}
                  <Radio className="w-8 h-8 mb-2" />
                  <span>CONNECT</span>
                </button>
              </div>
              
              {/* Transfer Form */}
              <TransferForm onTransfer={handleTransfer} />
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