import { NextResponse } from 'next/server';
import { 
  rpc, 
  Contract, 
  TransactionBuilder, 
  BASE_FEE, 
  Keypair, 
  TimeoutInfinite,
  nativeToScVal,
  Address, 
  BigInt
} from '@stellar/stellar-sdk';

// --- AYARLAR ---
const CONTRACT_ID = "CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK";
const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

// !!! GİZLİ ANAHTARINIZ !!!
const ADMIN_SECRET = "SBWQXDRZMJQBVET22CQ5RUZCBF5PQDORVYNEOFHZLWKFTIBMMIZYMSYV"; 
const DESTINATION_ID = "GDVLUTIOMMK544EX4542JZBU6CITTGBEGK6SMET5MH263JSD3YZZM5VX7"; 

export async function POST() {
  try {
    const server = new rpc.Server(RPC_URL);
    
    const sourceKeypair = Keypair.fromSecret(ADMIN_SECRET);
    const sourcePublicKey = sourceKeypair.publicKey();

    const account = await server.getAccount(sourcePublicKey); 
    const contract = new Contract(CONTRACT_ID);
    
    const amountToTransfer = BigInt(50000); 

    // KRİTİK DÜZELTME: Adresleri ve miktarı doğru tiplerde gönderiyoruz
    const args = [
      new Address(sourcePublicKey).toScVal(), 
      new Address(DESTINATION_ID).toScVal(),  
      nativeToScVal(amountToTransfer, { type: 'i128' }) 
    ];

    const operation = contract.call("transfer", ...args);

    const preparedTx = await server.prepareTransaction(
      operation,
      {
        source: sourcePublicKey,
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
        timebounds: TimeoutInfinite,
      }
    );

    preparedTx.sign(sourceKeypair);

    const response = await server.sendTransaction(preparedTx);

    if (response.status === "PENDING" || response.status === "SUCCESS") {
        return NextResponse.json({ status: "SUCCESS", hash: response.hash });
    } else {
        return NextResponse.json({ status: "FAIL", error: response });
    }

  } catch (error) {
    console.error("TRANSFER API KRİTİK HATA:", error);
    let message = "Bilinmeyen Hata. Lütfen Secret Key'inizi kontrol edin.";
    
    if (error && typeof error === 'object' && 'message' in error) {
        message = error.message;
    }
    return NextResponse.json({ status: "ERROR", message: message });
  }
}
