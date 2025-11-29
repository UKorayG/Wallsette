import { SorobanRpc, Contract, Address, scValToNative } from '@stellar/stellar-sdk';

// ---------------------------------------------------------
// SİSTEM AYARLARI (SENİN BACKEND BİLGİLERİN)
// ---------------------------------------------------------
const CONTRACT_ID = "CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK";
const RPC_URL = "https://soroban-testnet.stellar.org:443";
// Admin cüzdanı (Bakiye buradan okunacak)
const USER_ID = "GAFHRBGJ4765LCHPFP5VFP3B5B4Y6B4OGUUK4YRPJHOUE4T5X63MRZRB";

export async function getDecayBalance() {
  const server = new SorobanRpc.Server(RPC_URL);
  const contract = new Contract(CONTRACT_ID);

  // 'balance' fonksiyonunu çağır
  const operation = contract.call("balance", ...[
    new Address(USER_ID).toScVal()
  ]);

  try {
    // İşlemi simüle et (Bedava okuma)
    const result = await server.simulateTransaction(operation);

    if (SorobanRpc.Api.isSimulationSuccess(result)) {
      const balanceScVal = result.result.retval;
      const balance = scValToNative(balanceScVal);
      return balance.toString();
    } else {
      return "0";
    }
  } catch (error) {
    console.error("RPC Hatası:", error);
    return "ERR";
  }
}
