import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const WelcomeMessage = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to the Blockchain Dashboard
      </h2>
      <p className="mb-8 text-muted-foreground max-w-lg mx-auto">
        Connect your wallet to interact with smart contracts, view your balance,
        and stake tokens
      </p>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    </div>
  );
};
