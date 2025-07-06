"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SupplyChainProvider, useSupplyChain } from "../context/SupplyChainContext";
import SupplierCard from "../components/SupplierCard";
import OrderForm from "../components/OrderForm";
import FeedbackForm from "../components/FeedbackForm";
import Chatbot from "../components/Chatbot";
import { Batch } from "../lib/types";

function UserPageContent() {
  const { connected } = useWallet();
  const { allBatches, refreshData } = useSupplyChain();
  const [activeTab, setActiveTab] = useState("suppliers");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (connected) {
      refreshData();
    }
  }, [connected]);

  // Group batches by supplier
  const suppliersData = allBatches.reduce((acc: any[], batch) => {
    const existingSupplier = acc.find(s => s.address === batch.owner);
    if (existingSupplier) {
      existingSupplier.products.push(batch);
    } else {
      acc.push({
        name: `Supplier ${batch.owner.slice(0, 8)}...`,
        address: batch.owner,
        products: [batch]
      });
    }
    return acc;
  }, []);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">
          Please connect your wallet to access user features
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-2 font-medium ${
            activeTab === "suppliers"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Suppliers
        </button>
        <button
          onClick={() => setActiveTab("chatbot")}
          className={`px-4 py-2 font-medium ${
            activeTab === "chatbot"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Order Tracker
        </button>
      </div>

      {activeTab === "suppliers" && (
        <div className="space-y-6">
          {selectedBatch ? (
            <OrderForm
              batch={selectedBatch}
              onBack={() => setSelectedBatch(null)}
              onOrderSuccess={() => {
                setSelectedBatch(null);
                setActiveTab("chatbot");
              }}
            />
          ) : showFeedbackForm ? (
            <FeedbackForm
              orderId={selectedOrder.id}
              onSuccess={() => setShowFeedbackForm(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliersData.length > 0 ? (
                suppliersData.map((supplier, index) => (
                  <SupplierCard
                    key={index}
                    name={supplier.name}
                    address={supplier.address}
                    products={supplier.products}
                    onSelectBatch={setSelectedBatch}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No suppliers with available products found.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "chatbot" && (
        <div className="flex justify-center">
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default function UserPage() {
  return (
    <SupplyChainProvider>
      <UserPageContent />
    </SupplyChainProvider>
  );
}
