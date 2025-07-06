"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SupplyChainProvider } from "../context/SupplyChainContext";
import BatchCreationForm from "../components/BatchCreationForm";
import BatchLookup from "../components/BatchLookup";
import CertificationForm from "../components/CertificationForm";

export default function SupplierPage() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState("create");

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">
          Please connect your wallet to access supplier features
        </h2>
      </div>
    );
  }

  return (
    <SupplyChainProvider>
      <div className="space-y-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 font-medium ${
              activeTab === "create"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Create Batch
          </button>
          <button
            onClick={() => setActiveTab("lookup")}
            className={`px-4 py-2 font-medium ${
              activeTab === "lookup"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Batch Lookup
          </button>
          <button
            onClick={() => setActiveTab("certification")}
            className={`px-4 py-2 font-medium ${
              activeTab === "certification"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Certifications
          </button>
        </div>

        {activeTab === "create" && <BatchCreationForm />}
        {activeTab === "lookup" && <BatchLookup />}
        {activeTab === "certification" && <CertificationForm />}
      </div>
    </SupplyChainProvider>
  );
}
