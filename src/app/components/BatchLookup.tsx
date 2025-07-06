import { useState, useEffect } from "react";
import { useSupplyChain } from "../context/SupplyChainContext";
import BatchCard from "./BatchCard";

export default function BatchLookup() {
  const { allBatches, selectedBatch, setSelectedBatch, refreshData } =
    useSupplyChain();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const filteredBatches = allBatches.filter((batch) => {
    const productName = batch.productName || "";
    const productType = batch.productType || "";
    
    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? batch.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 text-black">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {selectedBatch ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => setSelectedBatch(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Back to all batches
          </button>
          <BatchCard batch={selectedBatch} detailed={true} showApproveButton={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onClick={() => setSelectedBatch(batch)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
