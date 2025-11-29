#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Balance(Address),
    MintTime(Address),
}

// AYARLAR: 1 Saniyede Binde 1 Erime
const DECAY_RATE_PER_SECOND: u64 = 1; 
const DENOMINATOR: u64 = 1000; 

#[contract]
pub struct DecayToken;

#[contractimpl]
impl DecayToken {
    // 1. PARA BAS (Mint)
    pub fn mint(env: Env, to: Address, amount: i128) {
        let current_time = env.ledger().timestamp();
        env.storage().instance().set(&DataKey::Balance(to.clone()), &amount);
        env.storage().instance().set(&DataKey::MintTime(to.clone()), &current_time);
    }

    // 2. BAKİYE SORGULA (Balance)
    pub fn balance(env: Env, owner: Address) -> i128 {
        let key_balance = DataKey::Balance(owner.clone());
        let key_time = DataKey::MintTime(owner.clone());
        
        if !env.storage().instance().has(&key_balance) {
            return 0;
        }

        let initial_balance: i128 = env.storage().instance().get(&key_balance).unwrap();
        let last_time: u64 = env.storage().instance().get(&key_time).unwrap_or(0);
        let current_time = env.ledger().timestamp();

        let elapsed = if current_time > last_time {
            current_time - last_time
        } else {
            0
        };

        // Formül: (Bakiye * Geçen Süre * Oran) / 1000
        let decay_amount = (initial_balance as u64)
            .checked_mul(elapsed)
            .unwrap_or(0)
            .checked_mul(DECAY_RATE_PER_SECOND)
            .unwrap_or(0)
            .checked_div(DENOMINATOR)
            .unwrap_or(0);

        let decay_amount_i128 = decay_amount as i128;

        if decay_amount_i128 >= initial_balance {
            return 0; // Para tamamen bitti
        }

        initial_balance - decay_amount_i128
    }

    // 3. TRANSFER (Sıcak Patates)
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        // Gönderenin güncel (erimiş) bakiyesini al
        let current_balance_from = Self::balance(env.clone(), from.clone());
        
        if current_balance_from < amount {
            panic!("Yetersiz bakiye! Paraniz eridi.");
        }

        // Gönderenden düş
        let new_balance_from = current_balance_from - amount;
        env.storage().instance().set(&DataKey::Balance(from.clone()), &new_balance_from);
        
        // Alıcıya ekle
        let current_balance_to = Self::balance(env.clone(), to.clone());
        let new_balance_to = current_balance_to + amount;
        env.storage().instance().set(&DataKey::Balance(to.clone()), &new_balance_to);
        
        // Alıcı için zamanı SIFIRLA (Taze Para)
        let current_time = env.ledger().timestamp();
        env.storage().instance().set(&DataKey::MintTime(to.clone()), &current_time);
    }
}
