"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useTokenData } from "@/hooks/useTokenData";
import { useTokenTransactions } from "@/hooks/useTokenTransactions";
import { useBlockchainHistory } from "@/hooks/useBlockchainHistory";

import { TokenBalance } from "@/components/dashboard/TokenBalance";
import { StakingCard } from "@/components/dashboard/StakingCard";
import { MintTokens } from "@/components/dashboard/MintTokens";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const needsHistoryRefresh = useRef(false);

  const { address, isConnected } = useAccount();

  const handleTransactionComplete = useCallback(() => {
    // Mark that we need a history refresh
    needsHistoryRefresh.current = true;
  }, []);

  // Token data
  const {
    tokenName,
    tokenSymbol,
    balance,
    stakingData,
    rewardRate,
    refreshAllData,
    isLoading: isDataLoading,
  } = useTokenData(address);

  // Transaction functionality
  const {
    txState,
    isPending,
    isConfirming,
    stakeAmount,
    setStakeAmount,
    mintAmount,
    setMintAmount,
    handleStake,
    handleUnstake,
    handleMint,
  } = useTokenTransactions(handleTransactionComplete);

  // Blockchain history (transactions and events)
  const {
    contractEvents,
    transactions,
    isLoadingHistory,
    currentTransactionsPage,
    currentEventsPage,
    setCurrentTransactionsPage,
    setCurrentEventsPage,
    totalTransactionPages,
    totalEventPages,
    getCurrentPageItems,
    generatePaginationItems,
    refreshHistory,
  } = useBlockchainHistory(address);

  // Set up client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set up auto-refresh for balance and staking information
  useEffect(() => {
    if (isConnected) {
      // Update balances every 15 seconds
      const longInterval = setInterval(() => {
        refreshAllData();
      }, 15000);

      return () => {
        clearInterval(longInterval);
      };
    }
  }, [isConnected, refreshAllData]);

  useEffect(() => {
    // If a transaction was completed and we marked for history refresh
    if (
      needsHistoryRefresh.current &&
      !txState.pendingConfirmation &&
      !txState.pendingTx
    ) {
      refreshAllData();

      const timer = setTimeout(() => {
        refreshHistory();
        needsHistoryRefresh.current = false;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [
    txState.pendingConfirmation,
    txState.pendingTx,
    refreshAllData,
    refreshHistory,
  ]);

  const handleManualRefresh = useCallback(() => {
    refreshHistory();
  }, [refreshHistory]);

  if (!isClient) {
    return (
      <main className="min-h-screen p-6 md:p-12">
        <div className="container mx-auto max-w-6xl">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">Loading Dashboard...</h1>
          </header>
        </div>
      </main>
    );
  }

  const isPendingTransaction =
    txState.pendingTx || txState.pendingConfirmation || isConfirming;

  return (
    <main className="min-h-screen p-6 md:p-12 relative">
      {isPendingTransaction && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <h3 className="font-bold text-lg mb-2">Transaction in Progress</h3>
            <p className="text-muted-foreground">
              {txState.pendingTx
                ? "Waiting for confirmation..."
                : "Transaction confirmed, waiting for block finalization..."}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Blockchain Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </header>

        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HowItWorks
              tokenSymbol={tokenSymbol ? String(tokenSymbol) : ""}
              rewardRate={rewardRate}
            />

            <TokenBalance
              balance={balance}
              symbol={tokenSymbol ? String(tokenSymbol) : ""}
              name={tokenName ? String(tokenName) : ""}
              isLoading={isDataLoading}
            />

            <StakingCard
              stakingData={stakingData}
              tokenSymbol={tokenSymbol ? String(tokenSymbol) : ""}
              rewardRate={rewardRate}
              stakeAmount={stakeAmount}
              onStakeAmountChange={setStakeAmount}
              onStake={() => handleStake(address)}
              onUnstake={() => handleUnstake(address)}
              isStaking={txState.isStaking}
              isUnstaking={txState.isUnstaking}
              isPending={isPending}
              stakingError={txState.stakingError}
              unstakingError={txState.unstakingError}
              stakingSuccess={txState.stakingSuccess}
              unstakingSuccess={txState.unstakingSuccess}
              isLoading={isDataLoading}
            />

            <MintTokens
              mintAmount={mintAmount}
              onMintAmountChange={setMintAmount}
              onMint={() => handleMint(address)}
              isMinting={txState.isMinting}
              isPending={isPending}
              mintError={txState.mintError}
              mintSuccess={txState.mintSuccess}
              isConnected={isConnected}
              isLoading={isDataLoading}
            />

            <TransactionHistory
              transactions={transactions}
              contractEvents={contractEvents}
              isLoadingHistory={isLoadingHistory}
              currentTransactionsPage={currentTransactionsPage}
              currentEventsPage={currentEventsPage}
              totalTransactionPages={totalTransactionPages}
              totalEventPages={totalEventPages}
              tokenSymbol={tokenSymbol ? String(tokenSymbol) : ""}
              onTransactionPageChange={setCurrentTransactionsPage}
              onEventPageChange={setCurrentEventsPage}
              getCurrentPageItems={getCurrentPageItems}
              generatePaginationItems={generatePaginationItems}
              onRefresh={handleManualRefresh}
            />
          </div>
        ) : (
          <WelcomeMessage />
        )}
      </div>
    </main>
  );
}
