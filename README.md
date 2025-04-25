# Blockchain Dashboard

A dashboard for interacting with blockchain smart contracts, including functionality for token staking, unstaking, and minting.

## Features

- Connect wallet using Rainbow Kit & wagmi
- View token balances
- Stake and unstake tokens
- Mint test tokens
- View transaction history
- Track contract events

## Technologies

- Next.js
- React
- Tailwind CSS
- wagmi
- Rainbow Kit
- ethers.js

### Token Dashboard

<img src="https://raw.githubusercontent.com/ThalesBMC/token-dashboard/main/public/images/tokenDashboard.png" width="1439" alt="Token Dashboard" />

### Transaction History

<img src="https://raw.githubusercontent.com/ThalesBMC/token-dashboard/main/public/images/transactionHistory.png" width="1439" alt="Transaction History" />

## Environment Setup

This project uses environment variables to configure API keys and endpoints. Follow these steps to set up your environment:

1. Copy the `.env.example` file to create a new `.env` file:

```bash
cp .env.example .env
```

2. Update the variables in the `.env` file with your own values:

```
# Blockchain Explorer API
NEXT_PUBLIC_EXPLORER_API_KEY=your_api_key_here  # Get from Basescan/Etherscan
NEXT_PUBLIC_EXPLORER_API_URL=https://api-sepolia.basescan.org/api  # Or your preferred network

# RPC URL
NEXT_PUBLIC_RPC_URL= https://sepolia.base.org
```

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Smart Contract Deployment

The dashboard is configured to work with a simple ERC20 token contract with staking capabilities. Here's how to deploy it:

### Prerequisites

- Install [Foundry](https://book.getfoundry.sh/) for smart contract development:

### Setting up the Smart Contract Environment

1. Create a `.env` file in your smart contract project with the following:

```
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Testing with Anvil (Local Development)

1. Start a local Ethereum node with Anvil:

```bash
anvil
```

2. In a separate terminal, deploy the contract to the local node:

```bash
forge script script/SimpleToken.s.sol:DeploySimpleToken --rpc-url http://localhost:8545 --private-key YOUR_PRIVATE_KEY --broadcast
```

This will deploy the contract to your local Anvil node, and you can interact with it using the dashboard. Remember to change the network to localhost.

### Deploying to Sepolia Testnet

To deploy to Sepolia testnet:

```bash

# Deploy to Sepolia
forge script script/SimpleToken.s.sol:DeploySimpleToken --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

## Updating the Dashboard

After deploying your contract, update the `tokenAddress` in the dashboard project's `constants/addresses.ts` with your deployed contract address.

## Using the Dashboard

1. Connect your wallet using the "Connect Wallet" button
2. Ensure your wallet is connected to the Sepolia testnet (or your local Anvil node)
3. View your token balance
4. Mint tokens
5. Stake tokens to earn rewards
6. Unstake tokens to claim rewards
7. See Transaction and Events

## License

MIT
