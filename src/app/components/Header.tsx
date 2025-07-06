import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletButton from "./WalletButton";

export default function Header() {
  const { connected } = useWallet();

  return (
    <header className="bg-white text-black shadow-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Supply Chain Dashboard
            </Link>

            {connected && (
              <nav className="flex space-x-6">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/supplier"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Supplier
                </Link>
                <Link
                  href="/user"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  User
                </Link>
              </nav>
            )}
          </div>

          <WalletButton />
        </div>
      </div>
    </header>
  );
}
