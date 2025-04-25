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

interface MintTokensProps {
  mintAmount: string;
  onMintAmountChange: (value: string) => void;
  onMint: () => Promise<void>;
  isMinting: boolean;
  isPending: boolean;
  mintError: string;
  mintSuccess: string;
  isConnected: boolean;
  isLoading?: boolean;
}

export const MintTokens = ({
  mintAmount,
  onMintAmountChange,
  onMint,
  isMinting,
  isPending,
  mintError,
  mintSuccess,
  isConnected,
  isLoading = false,
}: MintTokensProps) => {
  return (
    <Card className="col-span-1  md:col-span-3">
      <CardHeader>
        <CardTitle className="truncate">Mint Tokens</CardTitle>
        <CardDescription className="truncate">
          Mint tokens for testing purposes. Anyone can mint tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Amount to mint"
              value={mintAmount}
              onChange={(e) => onMintAmountChange(e.target.value)}
              disabled={isMinting || isLoading}
              className="overflow-hidden text-ellipsis max-w-full"
            />
            <Button
              onClick={onMint}
              disabled={
                !isConnected ||
                !mintAmount ||
                isMinting ||
                isPending ||
                isLoading
              }
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint"
              )}
            </Button>
          </div>
          {mintSuccess && <p className="text-green-500">{mintSuccess}</p>}
          {mintError && <p className="text-red-500">{mintError}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
