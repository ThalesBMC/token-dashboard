"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@/lib/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { customDarkTheme } from "@/lib/rainbowkit";
import React, { useEffect, useState } from "react";

const queryClient = new QueryClient();

const RainbowKitProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <RainbowKitProvider theme={customDarkTheme} modalSize="compact">
      {mounted ? children : null}
    </RainbowKitProvider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>dOrg Dashboard</title>
        <meta
          name="description"
          content="A blockchain dashboard for token staking and management"
        />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="blockchain-theme">
              <RainbowKitProviderWrapper>{children}</RainbowKitProviderWrapper>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
