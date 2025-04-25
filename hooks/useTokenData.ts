"use client";

import { useReadContract } from "wagmi";
import { tokenAbi } from "@/lib/tokenABI";
import { tokenAddress } from "@/constants/addresses";
import { formatEther } from "viem";
import { useMemo } from "react";

export const useTokenData = (address?: `0x${string}`) => {
  const { data: tokenName } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "name",
  });

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "symbol",
  });

  const {
    data: balance,
    refetch: refetchBalance,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    functionName: "balanceOf",
    abi: tokenAbi,
    args: [address || "0x0"],
  });

  const {
    data: stakingInfo,
    refetch: refetchStakingInfo,
    isError: stakingError,
    isLoading: stakingLoading,
  } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "getStakingInfo",
    args: [address || "0x0"],
  });

  const { data: owner } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "owner",
  });

  const { data: rewardRate } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "rewardRate",
  });

  const stakingData = useMemo(() => {
    if (!stakingInfo) {
      return { staked: "0", isStaking: false };
    }

    const [staked, , , isStaking] = stakingInfo as [
      bigint,
      bigint,
      bigint,
      boolean
    ];

    return {
      staked: formatEther(staked),
      isStaking,
    };
  }, [stakingInfo]);

  const isOwner = useMemo(() => {
    return owner === address;
  }, [owner, address]);

  const refreshAllData = () => {
    refetchBalance?.();
    refetchStakingInfo?.();
  };

  return {
    tokenName,
    tokenSymbol,
    balance: balance ? formatEther(balance) : "0",
    stakingData,
    isOwner,
    rewardRate,
    refreshAllData,
    refetchBalance,
    refetchStakingInfo,
    isLoading: balanceLoading || stakingLoading,
    isError: balanceError || stakingError,
  };
};
