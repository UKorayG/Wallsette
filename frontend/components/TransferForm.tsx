'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function TransferForm({ onTransfer }: { onTransfer: (to: string, amount: string) => Promise<void> }) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !amount) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    try {
      setIsLoading(true);
      setStatus(null);
      await onTransfer(toAddress, amount);
      setStatus({ 
        type: 'success', 
        message: `Transfer successful! Transaction hash: ${toAddress.substring(0, 10)}...` 
      });
      setToAddress('');
      setAmount('');
    } catch (error: any) {
      console.error('Transfer error:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Transfer failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#00f3ff22] mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center text-[#00f3ff]">
        <Send className="mr-2" /> TOKEN TRANSFER
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="to-address">
            Recipient Address:
          </label>
          <input
            id="to-address"
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter address starting with G"
            className="w-full p-3 bg-black/50 border border-[#00f3ff33] rounded text-white focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="amount">
            Amount (WALL):
          </label>
          <input
            id="amount"
            type="number"
            step="0.0000001"
            min="0.0000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0000000"
            className="w-full p-3 bg-black/50 border border-[#00f3ff33] rounded text-white focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
            required
          />
        </div>

        {status && (
          <div className={`p-3 rounded text-sm ${
            status.type === 'success' 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-red-900/30 text-red-400'
          }`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded font-medium flex items-center justify-center space-x-2 transition-colors ${
            isLoading
              ? 'bg-[#00f3ff33] text-[#00f3ff80] cursor-not-allowed'
              : 'bg-[#00f3ff] text-black hover:bg-[#00d9e6]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Transfer Tokens</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-[#00f3ff80]">
        <p>Note: Transferring tokens resets the decay timer for the recipient.</p>
      </div>
    </div>
  );
}
