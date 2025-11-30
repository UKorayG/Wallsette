'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface WalletTransferProps {
  balance: string;
  onTransfer: (to: string, amount: string) => Promise<boolean>;
}

export default function WalletTransfer({ balance, onTransfer }: WalletTransferProps) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!toAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onTransfer(toAddress, amount);
      if (success) {
        toast.success('Transfer successful!');
        setToAddress('');
        setAmount('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#00f3ff22]">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Send className="mr-2 h-5 w-5 text-[#00f3ff]" />
        Transfer Tokens
      </h2>
      
      <div className="mb-6 p-4 bg-[#0f0f0f] rounded border border-[#00f3ff11]">
        <div className="text-sm text-gray-400">Available Balance</div>
        <div className="text-2xl font-bold">{balance} WALLET</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="to"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter recipient's address"
            className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00f3ff22] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.0000001"
            min="0.000001"
            className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00f3ff22] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-[#00f3ff33] text-gray-400 cursor-not-allowed'
              : 'bg-[#00f3ff] text-black hover:bg-[#00e6f2]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            'Send Tokens'
          )}
        </button>
      </form>
    </div>
  );
}
