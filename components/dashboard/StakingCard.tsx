import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { formatDisplayValue } from "@/utils/formatting";

interface StakingCardProps {
  stakingData: {
    staked: string;
    isStaking: boolean;
  };
  tokenSymbol?: string;
  rewardRate?: bigint;
  stakeAmount: string;
  onStakeAmountChange: (value: string) => void;
  onStake: () => Promise<void>;
  onUnstake: () => Promise<void>;
  isStaking: boolean;
  isUnstaking: boolean;
  isPending: boolean;
  stakingError: string;
  unstakingError: string;
  stakingSuccess: string;
  unstakingSuccess: string;
  isLoading?: boolean;
}

export const StakingCard = ({
  stakingData,
  tokenSymbol,
  rewardRate,
  stakeAmount,
  onStakeAmountChange,
  onStake,
  onUnstake,
  isStaking,
  isUnstaking,
  isPending,
  stakingError,
  unstakingError,
  stakingSuccess,
  unstakingSuccess,
  isLoading = false,
}: StakingCardProps) => {
  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="truncate">Staking</CardTitle>
            <CardDescription className="truncate">
              Stake your tokens to earn rewards
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Staked Amount</p>
            {isLoading ? (
              <div className="flex items-center h-8 mt-1">
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                {formatDisplayValue(stakingData.staked)} {tokenSymbol || ""}
              </p>
            )}
          </div>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Staking APY</p>
            {isLoading ? (
              <div className="flex items-center h-8 mt-1">
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                {rewardRate ? `${rewardRate.toString()}%` : "1000%"}
              </p>
            )}
          </div>
        </div>

        {stakingData.isStaking && (
          <div className="bg-primary/10 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                i
              </div>
              <h3 className="font-medium">Staking Information</h3>
            </div>
            <p className="text-sm mb-2 break-words">
              Your current stake is{" "}
              <span className="overflow-hidden text-ellipsis font-bold">
                {formatDisplayValue(stakingData.staked)} {tokenSymbol || ""}
              </span>{" "}
              with an annual yield of{" "}
              <span className="font-bold inline-flex items-center">
                {rewardRate ? `${rewardRate.toString()}%` : "1000%"}
              </span>
              .
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => onStakeAmountChange(e.target.value)}
              className="overflow-hidden text-ellipsis max-w-full"
              disabled={isLoading || isStaking || isUnstaking || isPending}
            />
          </div>
          <Button
            onClick={onStake}
            disabled={
              parseInt(stakeAmount) < 1 ||
              !stakeAmount ||
              isPending ||
              isStaking ||
              isLoading
            }
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              "Stake Tokens"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={onUnstake}
            disabled={
              !stakingData.isStaking ||
              stakingData.staked === "0" ||
              isPending ||
              isUnstaking ||
              isLoading
            }
          >
            {isUnstaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unstaking...
              </>
            ) : (
              "Unstake All"
            )}
          </Button>
        </div>

        {stakingError && (
          <p className="text-red-500 mt-2 text-sm">{stakingError}</p>
        )}
        {unstakingError && (
          <p className="text-red-500 mt-2 text-sm">{unstakingError}</p>
        )}
        {stakingSuccess && (
          <p className="text-green-500 mt-2 text-sm">{stakingSuccess}</p>
        )}
        {unstakingSuccess && (
          <p className="text-green-500 mt-2 text-sm">{unstakingSuccess}</p>
        )}
      </CardContent>
    </Card>
  );
};
