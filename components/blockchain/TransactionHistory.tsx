import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { formatTimestamp } from "@/utils/formatting";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TransactionHistoryProps {
  transactions: any[];
  contractEvents: any[];
  isLoadingHistory: boolean;
  currentTransactionsPage: number;
  currentEventsPage: number;
  totalTransactionPages: number;
  totalEventPages: number;
  tokenSymbol?: string;
  onTransactionPageChange: (page: number) => void;
  onEventPageChange: (page: number) => void;
  getCurrentPageItems: (items: any[], page: number) => any[];
  generatePaginationItems: (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void
  ) => any[];
  onRefresh?: () => void;
}

export const TransactionHistory = ({
  transactions,
  contractEvents,
  isLoadingHistory,
  currentTransactionsPage,
  currentEventsPage,
  totalTransactionPages,
  totalEventPages,
  tokenSymbol,
  onTransactionPageChange,
  onEventPageChange,
  getCurrentPageItems,
  generatePaginationItems,
  onRefresh,
}: TransactionHistoryProps) => {
  // Memoize the current page items to avoid recalculation on every render
  const currentTransactions = useMemo(
    () => getCurrentPageItems(transactions, currentTransactionsPage),
    [transactions, currentTransactionsPage, getCurrentPageItems]
  );

  const currentEvents = useMemo(
    () => getCurrentPageItems(contractEvents, currentEventsPage),
    [contractEvents, currentEventsPage, getCurrentPageItems]
  );

  // Memoize the pagination items
  const transactionPaginationItems = useMemo(
    () =>
      generatePaginationItems(
        currentTransactionsPage,
        totalTransactionPages,
        onTransactionPageChange
      ),
    [
      currentTransactionsPage,
      totalTransactionPages,
      generatePaginationItems,
      onTransactionPageChange,
    ]
  );

  const eventPaginationItems = useMemo(
    () =>
      generatePaginationItems(
        currentEventsPage,
        totalEventPages,
        onEventPageChange
      ),
    [
      currentEventsPage,
      totalEventPages,
      generatePaginationItems,
      onEventPageChange,
    ]
  );

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="truncate">
            Transaction History & Events
          </CardTitle>
          <CardDescription className="truncate">
            View recent transactions and contract events
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoadingHistory}
          className="ml-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoadingHistory ? "animate-spin" : ""}`}
          />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="events">Contract Events</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {isLoadingHistory ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : transactions.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>
                      Recent transactions from your account
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tx Hash</TableHead>
                        <TableHead>Function</TableHead>
                        <TableHead>From/To</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Block/Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {tx.id.substring(0, 4) +
                              "..." +
                              tx.id.substring(tx.id.length - 4)}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {tx.function}
                            {tx.methodId && (
                              <div className="text-xs text-muted-foreground">
                                {tx.methodId}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <span className="font-medium">From:</span>{" "}
                              {tx.from.substring(0, 6) +
                                "..." +
                                tx.from.substring(tx.from.length - 4)}
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">To:</span>{" "}
                              {typeof tx.to === "string"
                                ? tx.to.substring(0, 6) +
                                  "..." +
                                  tx.to.substring(tx.to.length - 4)
                                : tx.to}
                            </div>
                          </TableCell>
                          <TableCell>{tx.value}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              Block: {tx.blockNumber}
                            </div>
                            <div className="text-xs">
                              {formatTimestamp(tx.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell
                            className={
                              tx.status === "Success"
                                ? "text-green-500"
                                : tx.status === "Failed"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                          >
                            {tx.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalTransactionPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      {currentTransactionsPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onTransactionPageChange(
                                Math.max(1, currentTransactionsPage - 1)
                              );
                            }}
                          />
                        </PaginationItem>
                      )}

                      {transactionPaginationItems.map((item) =>
                        item.isEllipsis ? (
                          <PaginationItem key={item.key}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item.key}>
                            <PaginationLink
                              href="#"
                              isActive={item.isActive}
                              onClick={(e) => {
                                e.preventDefault();
                                item.onClick();
                              }}
                            >
                              {item.page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      {currentTransactionsPage < totalTransactionPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onTransactionPageChange(
                                Math.min(
                                  totalTransactionPages,
                                  currentTransactionsPage + 1
                                )
                              );
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transactions found. Try staking or unstaking tokens.
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            {isLoadingHistory ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : contractEvents.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Recent events from the contract</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.event}
                          </TableCell>
                          <TableCell>
                            {event.event === "Staked" && (
                              <span>
                                {event.user} staked {event.amount}{" "}
                                {tokenSymbol || ""}
                              </span>
                            )}
                            {event.event === "Unstaked" && (
                              <span>
                                {event.user} unstaked {event.amount}{" "}
                                {tokenSymbol || ""}
                                (reward: {event.reward} {tokenSymbol || ""})
                              </span>
                            )}
                            {event.event === "Transfer" && (
                              <span>
                                {event.from} → {event.to}: {event.amount}{" "}
                                {tokenSymbol || ""}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{event.blockNumber}</TableCell>
                          <TableCell>
                            {formatTimestamp(event.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalEventPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      {currentEventsPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onEventPageChange(
                                Math.max(1, currentEventsPage - 1)
                              );
                            }}
                          />
                        </PaginationItem>
                      )}

                      {eventPaginationItems.map((item) =>
                        item.isEllipsis ? (
                          <PaginationItem key={item.key}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item.key}>
                            <PaginationLink
                              href="#"
                              isActive={item.isActive}
                              onClick={(e) => {
                                e.preventDefault();
                                item.onClick();
                              }}
                            >
                              {item.page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      {currentEventsPage < totalEventPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onEventPageChange(
                                Math.min(totalEventPages, currentEventsPage + 1)
                              );
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No events found. Try staking or unstaking tokens.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
