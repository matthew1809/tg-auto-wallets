'use client';

import { useEffect } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  SolanaWalletConnectors,
} from "../lib/dynamic";

import { GlobalWalletExtension } from "@dynamic-labs/global-wallet";

const inter = Inter({ subsets: ["latin"] });


const dynamicEnvId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!dynamicEnvId) {
    const errMsg =
      "Please add your Dynamic Environment to this project's .env file";
    console.error(errMsg);
    throw new Error(errMsg);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {  // Check if running in browser
      window.onerror = function(message, source, lineno, colno, error) {
        alert(`Error: ${message}\nAt: ${source}:${lineno}:${colno}\n${error?.stack}`);
        return false;
      };

      window.onunhandledrejection = function(event) {
        alert(`Promise error: ${event.reason}`);
      };
    }
  }, []);

  return (
    <html lang="en">
      <DynamicContextProvider
        settings={{
          environmentId: dynamicEnvId,
          walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
          walletConnectorExtensions: [GlobalWalletExtension]
        }}
      >
        <body className={inter.className}>{children}</body>
      </DynamicContextProvider>
    </html>
  );
}
