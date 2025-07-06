import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletReadyState } from "@aptos-labs/wallet-adapter-core";

export default function WalletButton() {
  const { connect, disconnect, account, connected, wallets } = useWallet();

  const handleConnect = async () => {
    const wallet = wallets.find(
      (w) => w.readyState === WalletReadyState.Installed
    );
    if (wallet) {
      try {
        await connect(wallet.name);
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  if (connected && account) {
    const addressStr = account.address.toString();
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {addressStr.slice(0, 6)}...{addressStr.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600 transition"
    >
      Connect Wallet
    </button>
  );
}
