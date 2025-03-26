#  Decentralized Prediction Market

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📌 Overview
This is a **decentralized prediction market** built on **Ethereum**, inspired by **Polymarket**. Users can place bets on event outcomes using ERC-20 tokens, ensuring **security, transparency, and trustless execution** via smart contracts.

## 🚀 Features
- **Decentralized Market Creation** – Users can create prediction markets with custom questions and options.
- **ERC-20 Token Betting** – Users stake tokens on selected outcomes.
- **Automated Resolution & Payouts** – Market owners resolve events, and winnings are distributed automatically.
- **Smart Contract Security** – Prevents reentrancy attacks and ensures fairness.
- **Transparent & Immutable** – All transactions recorded on the blockchain.

## 🛠️ Tech Stack
- **Solidity** – Smart contract development
- **Ethereum & EVM-compatible Chains**
- **Thirdweb & OpenZeppelin** – Secure contract extensions
- **Foundry** – Smart contract testing and development

## 📜 Smart Contract Functionality
### **1️⃣ Market Creation**
```solidity
function createMarket(
    string memory _question,
    string memory _optionA,
    string memory _optionB,
    uint256 _duration
) external returns (uint256);
```
- Allows only the owner to create a market.
- Sets the market question, options, and expiry time.

### **2️⃣ Buying Shares (Betting)**
```solidity
function buyShares(
    uint256 _marketId,
    bool _isOptionA,
    uint256 _amount
) external;
```
- Users stake tokens to support an outcome.
- Ensures the market is still active before allowing bets.

### **3️⃣ Resolving Markets**
```solidity
function resolveMarket(
    uint256 _marketId,
    MarketOutcome _outcome
) external;
```
- Only the owner can resolve the market after its end time.
- Determines the winning outcome and marks the market as resolved.

### **4️⃣ Claiming Winnings**
```solidity
function claimWinnings(uint256 _marketId) external;
```
- Users claim their rewards based on the correct prediction.
- Prevents multiple claims per user.

## Contributors

- **[Kushal Desai (23CS019)](https://github.com/KushalvDesai)**
- **[Jeet Dhaduk (23CS020)](https://github.com/23CS020DhadukJeet)**
