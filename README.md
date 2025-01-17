# 🌊 Liquidity Pool DApp - Peer2Play Assessment
---
[![Watch on YouTube]()  
---
## 🚀 Live Demo

Check out the live application deployed on Vercel:
- ✨ Demo URL: 
  
## 🚀 Introduction
This project is a decentralized application (DApp) that demonstrates the functionality of a liquidity pool on the Ethereum blockchain. It includes the deployment of two ERC20 tokens, a liquidity pool smart contract, and features such as adding/removing liquidity and token swapping. The DApp is built using Solidity, Hardhat, and React.js for a seamless user experience.

## 🏗️ Deployed Contracts
- **TokenA** deployed to: `0x903e8025d61Cc5E6F7bBD3bB8E841d025E18CD91`
- **TokenB** deployed to: `0xd859f69c72db8fb25059C2F7679d99660ef592e7`
- **LiquidityPoolFactory** deployed to: `0xB240eFC0391c53E41Db1F6992B6a1Fbb0b98dFbd`
- **LiquidityPoolRouter** deployed to: `0x123260d5b10d7481d8C5767C6c908fa4457E9258`
- **Liquidity Pool** created for:
  - **TokenA**: `0x2163A74F785943Fc5851F8D265f8Cc90542766E3`
  - **TokenB**: `0x5b99d19f051B0f80b4F37f6119F5Cb880f1293Fd`

## 🛠️ Features
1. **Create LiquidityPool**  
   Users can provide token addresses and create a liquidity pool.

2. **Add Liquidity**  
   Users can provide liquidity to the pool by depositing both tokens in equal value.

3. **Remove Liquidity**  
   Users can withdraw their share of liquidity, receiving both tokens proportionately.

4. **Swap Tokens**  
   Users can swap one token for another using the liquidity pool, following the automated market maker (AMM) model.
 5. **Token Details**  
   Users can see the Token details dynamically and all amount.
 6. **View Pool**  
   Users can see all the created pool address.
      

## 💡 How It Works
## 🏗️ Smart Contract Architecture

The smart contract architecture consists of four primary contracts: `TokenA`, `TokenB`, `LiquidityPool`, and `LiquidityPoolToken`. These contracts interact with each other to provide functionality for the liquidity pool, token swapping, and liquidity management.

### TokenA and TokenB
- **TokenA** and **TokenB** are ERC20 tokens representing the two assets in the liquidity pool.
- These tokens are minted at the time of contract deployment, with a total supply of 1 million tokens each.
- These tokens are used for the swapping and liquidity provision in the pool.

### LiquidityPool
- The **LiquidityPool** contract manages the core logic of adding liquidity, removing liquidity, and swapping tokens.
- It accepts `TokenA` and `TokenB` as its assets and manages the balance of these tokens in the pool.
- **Add Liquidity**: When users add liquidity, they provide an equal value of both tokens (TokenA and TokenB). The contract calculates the amount of liquidity pool (LP) tokens to mint for the user based on the share of liquidity they are providing relative to the total liquidity in the pool. If the pool is empty (first liquidity), it mints an initial amount of LP tokens.
- **Remove Liquidity**: Users can remove their liquidity by redeeming LP tokens. The contract burns the LP tokens and returns the appropriate proportion of TokenA and TokenB based on the amount of LP tokens the user holds relative to the total supply of LP tokens.
- **Swap**: The contract allows users to swap between TokenA and TokenB. It calculates the amount of the output token based on the current reserve ratios and the amount of input tokens provided by the user. The swap is subject to a small fee (0.3% is applied), which is deducted before the output amount is calculated.

### LiquidityPoolToken
- The **LiquidityPoolToken** is an ERC20 token representing a user's share in the liquidity pool.
- When users add liquidity, the contract mints new LP tokens proportional to their contribution to the pool. The more liquidity a user provides, the more LP tokens they will receive.
- The LP tokens are used as a claim to a user's portion of the liquidity in the pool. These tokens are burnt when users remove liquidity, and the equivalent amount of TokenA and TokenB is transferred back to them.
- Only the LiquidityPool contract can mint or burn these tokens, ensuring that only liquidity providers can manage LP tokens based on their liquidity share.

### LiquidityPoolFactory
- The **LiquidityPoolFactory** contract acts as a factory for creating new liquidity pools between any two tokens.
- It checks if a pool already exists for a given pair of tokens and prevents the creation of duplicate pools.
- When a new pool is created, it deploys a new instance of the `LiquidityPool` contract and stores the mapping between the two tokens and the newly created pool address.

### Design Considerations
- **ReentrancyGuard**: The `LiquidityPool` contract uses `ReentrancyGuard` from OpenZeppelin to prevent reentrancy attacks, ensuring that the liquidity addition, removal, and swapping operations are secure.
- **Initial LP Token Minting**: If the pool is empty, the contract mints LP tokens based on the first liquidity deposit, ensuring that the LP token holders' share in the pool is appropriately tracked.
- **Token Swapping Fees**: A 0.3% fee is applied to each token swap, which helps incentivize liquidity providers and maintain the pool’s health.
- **Security**: The contract ensures that only the LiquidityPool contract can mint and burn LP tokens, preventing malicious actors from manipulating liquidity token supply.

This architecture provides a decentralized and secure way to manage liquidity pools and token swaps on the Ethereum blockchain.



## 🚀 Getting Started

### Prerequisites
1. Node.js 
2. Hardhat
3. MetaMask browser extension

## 🖥️ Frontend Integration

The project includes a React-based frontend that provides:
- 👛 Wallet connection
- 💧 Liquidity provision interface
- 💱 Swap interface
- 📊 Pool share and balance display

## 🚀 Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/Manufg07/Peer2play.git
```

2. Install dependencies
```bash
npm install
```

3. Compile contracts
```bash
npx hardhat compile
```

4. Deploy contracts
```bash
npx hardhat ignition deploy .\ignition\modules\LiquidityPoolModule.js
```

5. Start frontend
```bash
npm run dev
```

## ⚙️ Environment Setup

Create a `.env` file with the following variables:
```
PRIVATE_KEY=your_private_key
```


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💾 Commit your changes
4. 🚀 Push to the branch
5. 📬 Open a pull request

For questions and support, please open an issue in the repository.
