"use client";

import { useState, useEffect, useCallback } from "react";
import { useBlockNumber, useConfig } from "wagmi";
import { zeroAddress, formatEther } from "viem";
import { ethers } from "ethers";
import { tokenAbi } from "@/lib/tokenABI";
import { tokenAddress } from "@/constants/addresses";
import { formatDisplayValue, formatTimestamp } from "@/utils/formatting";

interface EventWithArgs {
  transactionHash: string;
  index?: number;
  blockNumber?: number;
  args?: any[];
}

interface FormattedEvent {
  id: string;
  event: string;
  user?: string;
  from?: string;
  to?: string;
  amount: string;
  reward?: string;
  blockNumber: number;
  timestamp: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  function: string;
  methodId: string;
  value: string;
  gasInfo: string;
  timestamp: number;
  blockNumber: number;
  status: string;
}

export const useBlockchainHistory = (address?: `0x${string}`) => {
  const [contractEvents, setContractEvents] = useState<FormattedEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
  const [currentEventsPage, setCurrentEventsPage] = useState(1);
  const itemsPerPage = 10;

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const config = useConfig();

  const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_EXPLORER_API_KEY || "";
  const ETHERSCAN_API_URL = process.env.NEXT_PUBLIC_EXPLORER_API_URL || "";
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";

  const fetchContractEvents = useCallback(async () => {
    if (!address) return;

    setIsLoadingHistory(true);

    try {
      let provider;
      try {
        provider = new ethers.JsonRpcProvider(RPC_URL);
        // Test provider connection
        await provider.getBlockNumber();
      } catch (error) {
        console.error("Error connecting to provider:", error);
        setContractEvents([]);
        setIsLoadingHistory(false);
        return;
      }

      // Create contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        provider
      );

      const currentBlock = blockNumber ? Number(blockNumber) : 0;
      const lookbackBlocks = 2000; // How many blocks to look back
      const startBlock = Math.max(0, currentBlock - lookbackBlocks);

      let formattedEvents: FormattedEvent[] = [];

      // Get Staked events
      try {
        const stakedEvents = (await tokenContract.queryFilter(
          tokenContract.filters.Staked(address),
          startBlock
        )) as unknown as EventWithArgs[];
        console.log(stakedEvents);

        const formattedStakedEvents = stakedEvents.map((event) => {
          const args = event.args || [];
          const userAddress = args[0]?.toString() || "";
          const amount = args[1] || BigInt(0);

          return {
            id: `${event.transactionHash}-${event.index || 0}`,
            event: "Staked",
            user: userAddress.substring(0, 10) + "...",
            amount: formatDisplayValue(formatEther(amount)),
            blockNumber: event.blockNumber || 0,
            timestamp:
              Date.now() -
              ((blockNumber ? Number(blockNumber) : 0) -
                (event.blockNumber || 0)) *
                12000,
          };
        });

        formattedEvents = [...formattedEvents, ...formattedStakedEvents];
      } catch (error) {
        console.error("Error fetching Staked events:", error);
      }

      // Get Unstaked events
      try {
        const unstakedEvents = (await tokenContract.queryFilter(
          tokenContract.filters.Unstaked(address),
          startBlock
        )) as unknown as EventWithArgs[];

        const formattedUnstakedEvents = unstakedEvents.map((event) => {
          const args = event.args || [];
          const userAddress = args[0]?.toString() || "";
          const amount = args[1] || BigInt(0);
          const reward = args[2] || BigInt(0);

          return {
            id: `${event.transactionHash}-${event.index || 0}`,
            event: "Unstaked",
            user: userAddress.substring(0, 10) + "...",
            amount: formatDisplayValue(formatEther(amount)),
            reward: formatDisplayValue(formatEther(reward)),
            blockNumber: event.blockNumber || 0,
            timestamp:
              Date.now() -
              ((blockNumber ? Number(blockNumber) : 0) -
                (event.blockNumber || 0)) *
                12000,
          };
        });

        formattedEvents = [...formattedEvents, ...formattedUnstakedEvents];
      } catch (error) {
        console.error("Error fetching Unstaked events:", error);
      }

      // Get Transfer events related to the user
      try {
        const transferToEvents = (await tokenContract.queryFilter(
          tokenContract.filters.Transfer(null, address),
          startBlock
        )) as unknown as EventWithArgs[];

        const formattedTransferToEvents = transferToEvents.map((event) => {
          const args = event.args || [];
          const fromAddress = args[0]?.toString() || "";
          const toAddress = args[1]?.toString() || "";
          const amount = args[2] || BigInt(0);

          return {
            id: `${event.transactionHash}-${event.index || 0}`,
            event: "Transfer",
            from:
              fromAddress === zeroAddress
                ? "Minted"
                : fromAddress.substring(0, 10) + "...",
            to: toAddress.substring(0, 10) + "...",
            amount: formatDisplayValue(formatEther(amount)),
            blockNumber: event.blockNumber || 0,
            timestamp:
              Date.now() -
              ((blockNumber ? Number(blockNumber) : 0) -
                (event.blockNumber || 0)) *
                12000,
          };
        });

        formattedEvents = [...formattedEvents, ...formattedTransferToEvents];
      } catch (error) {
        console.error("Error fetching Transfer-to events:", error);
      }

      try {
        const transferFromEvents = (await tokenContract.queryFilter(
          tokenContract.filters.Transfer(address, null),
          startBlock
        )) as unknown as EventWithArgs[];

        const formattedTransferFromEvents = transferFromEvents.map((event) => {
          const args = event.args || [];
          const fromAddress = args[0]?.toString() || "";
          const toAddress = args[1]?.toString() || "";
          const amount = args[2] || BigInt(0);

          return {
            id: `${event.transactionHash}-${event.index || 0}`,
            event: "Transfer",
            from: fromAddress.substring(0, 10) + "...",
            to:
              toAddress === zeroAddress
                ? "Burned"
                : toAddress.substring(0, 10) + "...",
            amount: formatDisplayValue(formatEther(amount)),
            blockNumber: event.blockNumber || 0,
            timestamp:
              Date.now() -
              ((blockNumber ? Number(blockNumber) : 0) -
                (event.blockNumber || 0)) *
                12000,
          };
        });

        formattedEvents = [...formattedEvents, ...formattedTransferFromEvents];
      } catch (error) {
        console.error("Error fetching Transfer-from events:", error);
      }

      // Sort events by block (most recent first)
      const sortedEvents = formattedEvents.sort(
        (a, b) => b.blockNumber - a.blockNumber
      );

      setContractEvents(sortedEvents);
    } catch (error) {
      console.error("Error in fetchContractEvents:", error);
      setContractEvents([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [address, blockNumber, RPC_URL]);

  const fetchTransactionHistory = useCallback(async () => {
    if (!address) return;

    setIsLoadingHistory(true);

    try {
      const apiUrl = `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "1" && Array.isArray(data.result)) {
        // Limit to 40 most recent transactions
        const recentTransactions = data.result.slice(0, 40);

        const formattedTransactions = recentTransactions.map((tx: any) => {
          let functionName = tx.functionName || "Contract call";

          // If functionName is empty but we have a methodId, use methodId
          if (!functionName && tx.methodId) {
            functionName = tx.methodId;
          }

          // For simple ETH transfers
          if (tx.input === "0x" && tx.value !== "0") {
            functionName = "ETH Transfer";
          }

          let valueDisplay =
            tx.value !== "0"
              ? `${formatDisplayValue(formatEther(BigInt(tx.value)))} ETH`
              : "0";

          let gasInfo = "";
          if (tx.gasUsed) {
            const gasInEth = (Number(tx.gasUsed) * Number(tx.gasPrice)) / 1e18;
            gasInfo = `Gas: ${Number(gasInEth.toFixed(6))} ETH`;
          }

          return {
            id: tx.hash,
            from: tx.from,
            to: tx.to || "Contract Creation",
            function: functionName,
            methodId: tx.methodId || "",
            value: valueDisplay,
            gasInfo: gasInfo,
            timestamp: parseInt(tx.timeStamp) * 1000,
            blockNumber: parseInt(tx.blockNumber),
            status: tx.isError === "0" ? "Success" : "Failed",
          };
        });

        setTransactions(formattedTransactions);
      } else {
        console.error(
          "Error in API response:",
          data.message || "Invalid response format"
        );
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setTransactions([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [address, ETHERSCAN_API_KEY, ETHERSCAN_API_URL]);

  useEffect(() => {
    if (address) {
      fetchContractEvents();
      fetchTransactionHistory();
    }
  }, [address]);

  const totalTransactionPages = Math.ceil(
    (transactions?.length || 0) / itemsPerPage
  );
  const totalEventPages = Math.ceil(
    (contractEvents?.length || 0) / itemsPerPage
  );

  const getCurrentPageItems = useCallback(
    (items: any[], currentPage: number) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return items.slice(startIndex, startIndex + itemsPerPage);
    },
    [itemsPerPage]
  );

  const generatePaginationItems = useCallback(
    (
      currentPage: number,
      totalPages: number,
      setPage: (page: number) => void
    ) => {
      const items = [];

      items.push({
        key: "first",
        page: 1,
        isActive: currentPage === 1,
        onClick: () => setPage(1),
      });

      if (currentPage > 3) {
        items.push({ key: "ellipsis-start", isEllipsis: true });
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (i === 1 || i === totalPages) continue;

        items.push({
          key: i.toString(),
          page: i,
          isActive: currentPage === i,
          onClick: () => setPage(i),
        });
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push({ key: "ellipsis-end", isEllipsis: true });
      }

      if (totalPages > 1) {
        items.push({
          key: "last",
          page: totalPages,
          isActive: currentPage === totalPages,
          onClick: () => setPage(totalPages),
        });
      }

      return items;
    },
    []
  );

  const refreshHistory = useCallback(() => {
    fetchContractEvents();
    fetchTransactionHistory();
  }, [fetchContractEvents, fetchTransactionHistory]);

  return {
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
    formatTimestamp,
  };
};
