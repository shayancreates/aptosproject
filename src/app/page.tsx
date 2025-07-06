"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ProductBatch, BatchEvent, ActorReputation } from "./lib/types";
import BatchCreationForm from "./components/BatchCreationForm";
import BatchLookup from "./components/BatchLookup";
import EventLog from "./components/EventLog";
import MapVisualization from "./components/MapVisualization";
import TemperatureGraph from "./components/TemperatureGraph";
import ReputationDashboard from "./components/ReputationDashboard";
import Header from "./components/Header";
import { MODULE_ADDRESS, NODE_URL } from "./lib/constants";
import { useSupplyChainActions } from "./hooks/useSupplyChain";
import { SupplyChainProvider, useSupplyChain } from "./context/SupplyChainContext";

function HomeContent() {
  const { connected, account } = useWallet();
  const [activeTab, setActiveTab] = useState<
    "create" | "lookup" | "reputation"
  >("lookup");
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [events, setEvents] = useState<BatchEvent[]>([]);
  const [reputation, setReputation] = useState<ActorReputation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { initializeSupplyChain } = useSupplyChainActions();
  const { refreshData } = useSupplyChain();

  const checkInitialization = async () => {
    if (!account?.address) return;
    try {
      setIsLoading(true);
      // For now, simulate initialization check
      setIsInitialized(true);
      setReputation({
        address: account.address.toString(),
        score: 85,
        successful_deliveries: 12,
        disputes: 1
      });
    } catch (error) {
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReputation = async () => {
    if (!account?.address) return;
    try {
      setIsLoading(true);
      setReputation({
        address: account.address.toString(),
        score: 85,
        successful_deliveries: 12,
        disputes: 1
      });
      setIsInitialized(true);
    } catch (error) {
      setErrorMessage("Error fetching reputation: " + (error as any)?.message);
      console.error("Error fetching reputation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && account?.address) {
      checkInitialization();
      fetchReputation();
      refreshData();
    }
  }, [connected, account]);

  const handleInitialize = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await initializeSupplyChain();
      setIsInitialized(true);
      alert("Account initialized! You can now create batches.");
    } catch (error) {
      setErrorMessage("Error initializing account: " + (error as any)?.message);
      alert("Error initializing account. See console for details.");
      console.error("Error initializing account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{errorMessage}</div>
        )}
        {connected && !isInitialized && (
          <div className="mb-4">
            <button
              onClick={handleInitialize}
              className="py-2 px-4 bg-green-600 text-white rounded"
              disabled={isLoading}
            >
              Initialize Account
            </button>
          </div>
        )}

        <div className="flex mb-8 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "lookup"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("lookup")}
          >
            Batch Lookup
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "create"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Batch
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "reputation"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reputation")}
          >
            Reputation Dashboard
          </button>
        </div>

        {activeTab === "create" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Create New Batch</h2>
            <BatchCreationForm />
          </div>
        )}

        {activeTab === "lookup" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Batch Lookup</h2>
              <BatchLookup />
            </div>

            {selectedBatch && selectedBatch.events && Array.isArray(selectedBatch.events) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Event Log</h2>
                <EventLog batch={selectedBatch} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Location History
                </h2>
                <MapVisualization batchId={selectedBatch?.id || ""} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Temperature Monitoring
                </h2>
                <TemperatureGraph events={selectedBatch?.events || []} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "reputation" && reputation && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Your Reputation</h2>
            <ReputationDashboard reputation={reputation} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <SupplyChainProvider>
      <HomeContent />
    </SupplyChainProvider>
  );
}
