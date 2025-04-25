"use client";

import { useState, useCallback, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { tokenAddress } from "@/constants/addresses";
import { tokenAbi } from "@/lib/tokenABI";

type TransactionType = "mint" | "stake" | "unstake" | null;

interface TransactionState {
  isMinting: boolean;
  isStaking: boolean;
  isUnstaking: boolean;

  mintSuccess: string;
  stakingSuccess: string;
  unstakingSuccess: string;

  mintError: string;
  stakingError: string;
  unstakingError: string;

  pendingTx: boolean;
  pendingConfirmation: boolean;
}

export const useTokenTransactions = (onTransactionComplete?: () => void) => {
  const [txState, setTxState] = useState<TransactionState>({
    isMinting: false,
    isStaking: false,
    isUnstaking: false,
    mintSuccess: "",
    stakingSuccess: "",
    unstakingSuccess: "",
    mintError: "",
    stakingError: "",
    unstakingError: "",
    pendingTx: false,
    pendingConfirmation: false,
  });

  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [currentTransactionType, setCurrentTransactionType] =
    useState<TransactionType>(null);

  const [stakeAmount, setStakeAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAddress, setMintAddress] = useState("");

  const { writeContractAsync: writeContract, isPending } = useWriteContract();

  const { data: transactionReceipt, isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    });

  useEffect(() => {
    setTxState((prev) => ({
      ...prev,
      pendingConfirmation: isConfirming,
    }));
  }, [isConfirming]);

  useEffect(() => {
    setTxState((prev) => ({
      ...prev,
      pendingTx: isPending,
    }));
  }, [isPending]);

  // Clear notifications after delay
  const clearNotificationsAfterDelay = useCallback(() => {
    setTimeout(() => {
      setTxState((prevState) => ({
        ...prevState,
        mintSuccess: "",
        stakingSuccess: "",
        unstakingSuccess: "",
        mintError: "",
        stakingError: "",
        unstakingError: "",
      }));
    }, 5000);
  }, []);

  const handleStake = useCallback(
    async (address: `0x${string}` | undefined) => {
      if (!stakeAmount || !address) return;

      // Reset error and success messages
      setTxState((prevState) => ({
        ...prevState,
        stakingError: "",
        stakingSuccess: "",
        unstakingSuccess: "",
        mintSuccess: "",
        isStaking: true,
      }));

      try {
        const hash = await writeContract({
          address: tokenAddress as `0x${string}`,
          abi: tokenAbi,
          functionName: "stakeTokens",
          args: [parseEther(stakeAmount)],
        });

        setStakeAmount("");
        setTransactionHash(hash);
        setCurrentTransactionType("stake");
      } catch (error) {
        console.error("Error staking tokens:", error);
        setTxState((prevState) => ({
          ...prevState,
          stakingError: "Failed to stake tokens. Please try again.",
          isStaking: false,
        }));
        clearNotificationsAfterDelay();
      }
    },
    [stakeAmount, writeContract, clearNotificationsAfterDelay]
  );

  const handleUnstake = useCallback(
    async (address: `0x${string}` | undefined) => {
      if (!address) return;

      // Reset error and success messages
      setTxState((prevState) => ({
        ...prevState,
        unstakingError: "",
        unstakingSuccess: "",
        stakingSuccess: "",
        mintSuccess: "",
        isUnstaking: true,
      }));

      try {
        const hash = await writeContract({
          address: tokenAddress as `0x${string}`,
          abi: tokenAbi,
          functionName: "unstakeTokens",
        });

        setTransactionHash(hash);
        setCurrentTransactionType("unstake");
      } catch (error) {
        console.error("Error unstaking tokens:", error);
        setTxState((prevState) => ({
          ...prevState,
          unstakingError: "Failed to unstake tokens. Please try again.",
          isUnstaking: false,
        }));
        clearNotificationsAfterDelay();
      }
    },
    [writeContract, clearNotificationsAfterDelay]
  );

  const handleMint = useCallback(
    async (address: `0x${string}` | undefined) => {
      if (!mintAmount || !address) return;

      // Reset error and success messages
      setTxState((prevState) => ({
        ...prevState,
        mintSuccess: "",
        mintError: "",
        isMinting: true,
      }));

      try {
        const hash = await writeContract({
          address: tokenAddress as `0x${string}`,
          abi: tokenAbi,
          functionName: "mint",
          args: [address, parseEther(mintAmount)],
        });

        setTransactionHash(hash);
        setCurrentTransactionType("mint");
        setMintAmount("");
      } catch (error) {
        console.error("Error minting tokens:", error);
        setTxState((prevState) => ({
          ...prevState,
          mintError: "Failed to mint tokens. Please try again.",
          isMinting: false,
        }));
        clearNotificationsAfterDelay();
      }
    },
    [mintAmount, writeContract, clearNotificationsAfterDelay]
  );

  useEffect(() => {
    if (transactionReceipt && currentTransactionType) {
      // Transaction confirmed, update state based on transaction type
      if (currentTransactionType === "mint" && txState.isMinting) {
        setTxState((prevState) => ({
          ...prevState,
          mintSuccess:
            "Transaction confirmed! Tokens were successfully minted.",
          isMinting: false,
        }));
      } else if (currentTransactionType === "stake" && txState.isStaking) {
        setTxState((prevState) => ({
          ...prevState,
          stakingError: "",
          mintSuccess: "",
          stakingSuccess:
            "Transaction confirmed! Tokens were successfully staked.",
          isStaking: false,
        }));
      } else if (currentTransactionType === "unstake" && txState.isUnstaking) {
        setTxState((prevState) => ({
          ...prevState,
          unstakingError: "",
          mintSuccess: "",
          unstakingSuccess:
            "Transaction confirmed! Tokens were successfully unstaked.",
          isUnstaking: false,
        }));
      }

      // Reset transaction data
      setTransactionHash(undefined);
      setCurrentTransactionType(null);

      // Call the callback to refresh data
      if (onTransactionComplete) {
        onTransactionComplete();
      }

      clearNotificationsAfterDelay();
    }
  }, [
    transactionReceipt,
    currentTransactionType,
    txState.isMinting,
    txState.isStaking,
    txState.isUnstaking,
    clearNotificationsAfterDelay,
    onTransactionComplete,
  ]);

  return {
    txState,
    isPending,
    isConfirming: isConfirming,
    stakeAmount,
    setStakeAmount,
    mintAmount,
    setMintAmount,
    mintAddress,
    setMintAddress,
    handleStake,
    handleUnstake,
    handleMint,
  };
};
