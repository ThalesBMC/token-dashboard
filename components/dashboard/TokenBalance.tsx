import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatDisplayValue } from "@/utils/formatting";

interface TokenBalanceProps {
  balance: string;
  symbol?: string;
  name?: string;
  isLoading?: boolean;
}

export const TokenBalance = ({
  balance,
  symbol,

  isLoading = false,
}: TokenBalanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">Token Balance</CardTitle>
        <CardDescription className="truncate">
          Your current {symbol || ""} balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center h-12 mb-4">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mr-2" />
            <span className="text-muted-foreground">Loading balance...</span>
          </div>
        ) : (
          <div className="text-3xl font-bold mb-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {formatDisplayValue(balance)} {symbol || ""}
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          Need tokens? This is a test contract, so you'll need the contract
          owner to mint you some tokens.
        </p>
      </CardContent>
    </Card>
  );
};
