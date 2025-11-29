# █▓▒░ WALLSETTE PROTOCOL

> "Static money is a bug. Decay is the feature."

![License](https://img.shields.io/badge/license-MIT-green)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)
![Status](https://img.shields.io/badge/status-ONLINE-red)

## 💀 THE MANIFESTO

Modern economies are built on hoarding. Value is stored, frozen, and accumulated. **Wallsette** challenges this concept. It is a biological financial experiment on the Stellar Network where money behaves like organic matter: **It rots.**

If you hold it, you lose it. To preserve value, you must move it.

---

## ⚙️ SYSTEM ARCHITECTURE (SOROBAN)

Wallsette is not a standard token. It is a custom implementation of a **Time-Decay Asset** written in Rust.

### The Math of Decay
Unlike linear inflation, Wallsette uses a localized time-delta calculation for every wallet.

$$B(t) = B_0 - \frac{B_0 \times \Delta t \times R}{1000}$$

* **$B_0$**: Initial Balance at receipt.
* **$\Delta t$**: Time elapsed since last transaction (seconds).
* **$R$**: Decay Rate (0.1% per second).

### The "Hot Potato" Mechanism
* **Holding:** Balance decreases every second.
* **Transfer:** When funds are moved to a new address, the recipient's "Time To Live" (TTL) resets. The money becomes "fresh" again.

---

## 📡 DEPLOYMENT DATA

The protocol is live on Stellar Testnet.

| Component | Status | Identifier |
| :--- | :--- | :--- |
| **Network** | Testnet | Futurenet / Soroban-20 |
| **Contract ID** | `CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCSCZVF323SG7EMAIJSTKTOVILHOLUWUYPP54OERIXDVVKZESATID7MK) |
| **Admin Wallet** | Active | `GAFHRBGJ...MRZRB` |

---

## 💻 TECH STACK

### Backend (The Core)
* **Language:** Rust
* **Platform:** Stellar Soroban SDK (v23.2.1)
* **Build Target:** `wasm32-unknown-unknown`

### Frontend (The Glitch)
* **Framework:** Next.js 14
* **Styling:** TailwindCSS + Framer Motion
* **Integration:** `@stellar/stellar-sdk` (RPC Simulation)

---

## 🚀 QUICK START

### 1. Clone the Repository
```bash
git clone [https://github.com/UKorayG/Wallsette.git](https://github.com/UKorayG/Wallsette.git)
cd Wallsette# Wallsette
