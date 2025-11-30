import { NextResponse } from 'next/server';
import { 
  rpc, 
  Contract, 
  TransactionBuilder, 
  BASE_FEE, 
  Keypair, 
  TimeoutInfinite,
  nativeToScVal,
  StrKey,
  scValToNative,
  xdr,
  Transaction,
  Networks
} from '@stellar/stellar-sdk';

// Helper function to convert Stellar public key to contract address
function publicKeyToContractAddress(publicKey: string) {
  try {
    console.log('[DEBUG] Raw public key input:', publicKey);
    
    if (!publicKey) {
      throw new Error('Public key is required');
    }

    // Remove any whitespace and convert to uppercase
    const cleanKey = publicKey.trim().toUpperCase();
    
    console.log('[DEBUG] Cleaned public key:', cleanKey);
    
    // Basic validation
    if (typeof cleanKey !== 'string') {
      throw new Error(`Invalid key type: ${typeof cleanKey} (expected string)`);
    }

    if (cleanKey.length !== 56) {
      throw new Error(`Invalid key length: ${cleanKey.length} (expected 56)`);
    }
    
    if (!cleanKey.startsWith('G')) {
      throw new Error('Stellar public key must start with "G"');
    }

    // Check for valid characters (only A-Z and 2-7 after the first character)
    if (!/^G[A-Z2-7]{55}$/.test(cleanKey)) {
      throw new Error('Public key contains invalid characters. Only A-Z and 2-7 are allowed after the initial G');
    }
    
    try {
      // Try to decode the key
      console.log('[DEBUG] Attempting to decode public key with StrKey');
      const bytes = StrKey.decodeEd25519PublicKey(cleanKey);
      
      if (!bytes || bytes.length !== 32) {
        throw new Error(`Decoded key has invalid length: ${bytes ? bytes.length : 'null'}`);
      }
      
      const hexString = Buffer.from(bytes).toString('hex');
      console.log('[DEBUG] Successfully converted key to hex:', hexString);
      return hexString;
    } catch (decodeError) {
      console.error('[ERROR] Failed to decode public key with StrKey:', decodeError);
      
      // Try alternative approach if standard decoding fails
      try {
        console.log('[DEBUG] Trying alternative decoding method');
        // If it's already in hex format (64 chars), return as is
        if (/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
          console.log('[DEBUG] Key appears to be in hex format, returning as-is');
          return cleanKey.toLowerCase();
        }
        
        // Additional check for base32 encoded keys
        if (/^G[A-Z2-7]{55}$/.test(cleanKey)) {
          console.log('[DEBUG] Key appears to be in base32 format, attempting manual conversion');
          // This is a simple fallback, but StrKey should have handled this
          // If we get here, the key might be malformed in a way that passes regex but fails StrKey
          throw new Error('Key format appears valid but could not be decoded');
        }
        
        throw new Error(`Unrecognized key format: ${cleanKey.substring(0, 10)}...`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('[ERROR] Alternative decoding failed:', errorMessage);
        throw new Error(`Failed to process public key: ${errorMessage}. Please verify the key is a valid Stellar public key.`);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during public key processing';
    console.error('[CRITICAL] Public key validation error:', errorMessage);
    throw new Error(`Key validation failed: ${errorMessage}`);
  }
}

// --- AYARLAR ---
const CONTRACT_ID = "CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK";
const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

// Admin hesabı için secret key (güvenli bir yerde saklanmalıdır)
const ADMIN_SECRET = "SBWQXDRZMJQBVET22CQ5RUZCBF5PQDORVYNEOFHZLWKFTIBMMIZYMSYV";
// Secret key'den public key'i alıyoruz
const ADMIN_KEYPAIR = Keypair.fromSecret(ADMIN_SECRET);
const ADMIN_PUBLIC = ADMIN_KEYPAIR.publicKey();

// Varsayılan hedef adres (isteğe bağlı olarak değiştirilebilir)
const DESTINATION_ID = "GDVLUTIOMMK544EX4542JZBU6CITTGBEGK6SMET5MH263JSD3YZZM5VX7"; 

interface ErrorWithMessage extends Error {
  message: string;
  response?: any;
  data?: any;
}

export async function POST(request: Request) {
  try {
    const server = new rpc.Server(RPC_URL);
    const { destination, amount } = await request.json();
    
    // Validate input
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json(
        { error: 'Destination address is required' },
        { status: 400 }
      );
    }
    
    // Validate environment variables
    if (!ADMIN_SECRET) {
      throw new Error('Server error: Missing admin secret');
    }
    
    // Clean and validate the destination address
    const cleanDestination = destination.trim().toUpperCase();
    if (cleanDestination.length !== 56 || !cleanDestination.startsWith('G')) {
      return NextResponse.json(
        { error: 'Invalid destination address format' },
        { status: 400 }
      );
    }

    // Artık public key'i doğrudan kullanıyoruz
    const sourceKeypair = ADMIN_KEYPAIR;
    const sourcePublicKey = ADMIN_PUBLIC;

    // Get account info to check balance and sequence number
    let account;
    try {
      account = await server.getAccount(sourcePublicKey);
    } catch (error) {
      console.error('Failed to fetch account:', error);
      throw new Error('Failed to fetch account information. Please try again.');
    }
    
    const contract = new Contract(CONTRACT_ID);
    
    try {
      // Use the amount from the request or default to 50000
      const amountToTransfer = BigInt(amount || 50000);
      
      // Check if amount is valid
      if (amountToTransfer <= 0) {
        throw new Error('Gecersiz miktar. Lutfen 0dan buyuk bir deger girin.');
      }
      
      // Convert public keys to contract addresses
      console.log('Converting source public key to contract address:', sourcePublicKey);
      const sourceAddress = publicKeyToContractAddress(sourcePublicKey);
      
      console.log('Converting destination public key to contract address:', cleanDestination);
      const destAddress = publicKeyToContractAddress(cleanDestination);
      
      // Check if source and destination are the same
      if (sourcePublicKey === cleanDestination) {
        throw new Error('Gönderici ve alıcı adresleri aynı olamaz');
      }
      
      // Check account balance before proceeding
      const accountInfo = await server.getAccount(sourcePublicKey);
      
      // Type definition for balance object
      interface Balance {
        balance: string;
        asset_type: string;
        // Add other properties if needed
      }
      
      const nativeBalance = (accountInfo as any).balances.find((b: Balance) => b.asset_type === 'native');
      
      if (!nativeBalance) {
        throw new Error('Hesapta XLM bulunamadı');
      }
      
      const balance = BigInt(nativeBalance.balance);
      
      // Add some buffer for transaction fees (0.1 XLM)
      const requiredAmount = amountToTransfer + BigInt(100000);
      
      if (balance < requiredAmount) {
        throw new Error(`Yetersiz bakiye. Mevcut bakiye: ${balance}, Gerekli: ${requiredAmount}`);
      }
      
      // Prepare the function arguments
      const args = [
        // Source address (bytes)
        xdr.ScVal.scvBytes(Buffer.from(sourceAddress, 'hex')),
        // Destination address (bytes)
        xdr.ScVal.scvBytes(Buffer.from(destAddress, 'hex')),
        // Amount (i128)
        nativeToScVal(amountToTransfer.toString(), { type: 'i128' })
      ];

      // Create the operation
      const operation = contract.call("transfer", ...args);

      // Build the transaction with a 2-minute timeout and higher fee
      const tx = new TransactionBuilder(account, {
        fee: (parseInt(BASE_FEE) * 100).toString(), // Increase fee for better confirmation
        networkPassphrase: NETWORK_PASSPHRASE,
        timebounds: {
          minTime: 0,
          maxTime: Math.floor(Date.now() / 1000) + 120 // 120 seconds from now
        }
      })
        .addOperation(operation)
        .build();
      
      // Sign the transaction
      tx.sign(sourceKeypair);

      try {
        console.log('Sending transaction to Stellar network...');
        let response;
        try {
          response = await server.sendTransaction(tx);
          
          if (!response || !response.hash) {
            throw new Error('Stellar ağından geçersiz yanıt alındı');
          }
          
          console.log('Transaction submitted, hash:', response.hash);
          
          // Wait for the transaction to complete
          console.log('Waiting for transaction confirmation...');
          const txResult = await server.getTransaction(response.hash);
          
          if ('successful' in txResult && !txResult.successful) {
            console.error('Transaction failed:', txResult);
            throw new Error('İşlem başarısız oldu. Lütfen daha sonra tekrar deneyin.');
          }
          
          console.log('Transaction successful:', txResult);
        } catch (submitError) {
          console.error('Error submitting transaction:', submitError);
          const errorMessage = submitError instanceof Error ? submitError.message : 'Bilinmeyen bir hata oluştu';
          
          // More specific error messages for common issues
          if (errorMessage.includes('tx_bad_seq')) {
            throw new Error('Sıra numarası geçersiz. Lütfen bir süre bekleyip tekrar deneyin.');
          } else if (errorMessage.includes('tx_insufficient_balance')) {
            throw new Error('Yetersiz bakiye. İşlem ücretini karşılamak için yeterli XLM bulunamadı.');
          } else if (errorMessage.includes('tx_bad_auth')) {
            throw new Error('Yetkilendirme hatası. Lütfen hesap bilgilerinizi kontrol edin.');
          } else {
            throw new Error(`İşlem sırasında hata oluştu: ${errorMessage}`);
          }
        }

        return NextResponse.json({ 
          status: "SUCCESS", 
          hash: response.hash,
          message: 'Transfer initiated successfully' 
        });
      } catch (error: any) {
        console.error('Transaction submission error:', error);
        
        // Try to extract more detailed error information
        let errorMessage = 'Failed to submit transaction';
        if (error.response && error.response.data) {
          errorMessage += ': ' + JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Transaction error:', error);
      
      // Handle specific Stellar SDK errors
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        return NextResponse.json(
          { 
            status: "ERROR", 
            message: errorData.detail || 'Transaction failed',
            code: errorData.extras?.result_codes?.transaction || 'unknown_error'
          },
          { status: 400 }
        );
      }
      
      throw error; // Re-throw to be caught by the outer catch
    }
    
  } catch (error) {
    console.error("Transfer API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const status = 500;
    
    return NextResponse.json(
      { 
        status: "ERROR", 
        message: errorMessage,
        code: 'internal_error'
      },
      { status }
    );
  }
}