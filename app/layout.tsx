'use client';

import { useEffect } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  SolanaWalletConnectors,
} from "../lib/dynamic";

import { GlobalWalletExtension } from "@dynamic-labs/global-wallet";

import LogDisplay from './components/LogDisplay';

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
    if (typeof window !== 'undefined') {
      // Global error handler
      window.onerror = function(message, source, lineno, colno, error) {
        alert(`Global Error:\nMessage: ${message}\nSource: ${source}\nLine: ${lineno}\nStack: ${error?.stack}`);
        return false;
      };
 
      // Promise rejection handler 
      window.onunhandledrejection = function(event) {
        alert(`Unhandled Promise:\n${event.reason}`);
      };
 
      // Override console.error
      const originalConsoleError = console.error;
      console.error = (...args) => {
        originalConsoleError.apply(console, args);
        const errorMessage = args
          .map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)
          .join('\n');
        alert(`Console Error:\n${errorMessage}`);
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
        <body className={inter.className}>
          {children}
          <LogDisplay />
        </body>
      </DynamicContextProvider>
    </html>
  );
}