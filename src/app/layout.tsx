"use client";

import "./styles/globals.css";
import { Inter } from "next/font/google";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import WalletButton from "./components/WalletButton";
import ErrorBoundary from "./components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-platinum`}>
        <ErrorBoundary>
          <AptosWalletAdapterProvider
            autoConnect={true}
            dappConfig={{ network: Network.TESTNET }}
            onError={(error) => console.error("Wallet Error:", error)}
          >
            <div className="min-h-screen">
              <header className="bg-blue-500 text-black p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
                  <WalletButton />
                </div>
              </header>
              <main className="container mx-auto p-4">{children}</main>
            </div>
          </AptosWalletAdapterProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
