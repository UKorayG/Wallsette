import { NextResponse } from 'next/server';
import { 
  rpc, 
  Contract, 
  Address, 
  scValToNative, 
  Account, 
  TransactionBuilder, 
  BASE_FEE, 
  Networks 
} from '@stellar/stellar-sdk';

const CONTRACT_ID = "CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK";
const RPC_URL = "https://soroban-testnet.stellar.org:443";
const USER_ID = "GAFHRBGJ4765LCHPFP5VFP3B5B4Y6B4OGUUK4YRPJHOUE4T5X63MRZRB";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export async function GET() {
  try {
    const server = new rpc.Server(RPC_URL);
    
    // 1. Kaynak Hesabı Hazırla (Simülasyon için sahte bir Account objesi yeterli)
    // Sequence number '0' veriyoruz çünkü işlem yapmayacağız, sadece soracağız.
    const sourceAccount = new Account(USER_ID, "0");

    // 2. Kontrat ve Operasyonu Hazırla
    const contract = new Contract(CONTRACT_ID);
    const operation = contract.call("balance", ...[
      new Address(USER_ID).toScVal()
    ]);

    // 3. TRANSACTION PAKETLEME (İşte eksik olan parça buydu!)
    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30) // Zaman aşımı
      .build();

    // 4. Simülasyon
    const result = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationSuccess(result)) {
      const balanceScVal = result.result.retval;
      const balance = scValToNative(balanceScVal);
      
      // Terminalde çalıştığını görelim
      console.log(">>> GÜNCEL BAKİYE:", balance.toString());
      
      return NextResponse.json({ value: balance.toString() });
    } else {
      console.error("Simülasyon Hatası:", result);
      return NextResponse.json({ value: "SIM_FAIL" });
    }

  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ value: "ERR_BUILD" });
  }
}
