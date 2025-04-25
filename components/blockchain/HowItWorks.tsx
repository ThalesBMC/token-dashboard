import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HowItWorksProps {
  tokenSymbol?: string;
  rewardRate?: bigint;
}

export const HowItWorks = ({ tokenSymbol, rewardRate }: HowItWorksProps) => {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>How It Works</CardTitle>
        <CardDescription>Understanding the Staking Process</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="font-medium">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Connect to the Sepolia Base testnet using MetaMask or another
                Web3 wallet
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="font-medium">Get Test Tokens</h3>
              <p className="text-muted-foreground">
                Mint test tokens directly through the interface - anyone can
                mint tokens for testing
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="font-medium">Stake Your Tokens</h3>
              <p className="text-muted-foreground">
                Stake your {tokenSymbol || ""} tokens to earn rewards over time
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
              4
            </div>
            <div>
              <h3 className="font-medium">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Earn {rewardRate ? `${rewardRate.toString()}%` : "1000%"} APY on
                your staked tokens - the longer you stake, the more you earn
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
              5
            </div>
            <div>
              <h3 className="font-medium">Unstake Anytime</h3>
              <p className="text-muted-foreground">
                Withdraw your staked tokens and claim rewards at any time
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
