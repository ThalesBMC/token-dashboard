import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";

const localChain = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

export const config = getDefaultConfig({
  appName: "Blockchain Dashboard",
  projectId: "12312312",
  chains: [baseSepolia, localChain],
  transports: {
    [baseSepolia.id]: http(),
    [localChain.id]: http(),
  },
  // Only use MetaMask and injected wallets (no WalletConnect)
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, injectedWallet],
    },
  ],
  ssr: true,
});
