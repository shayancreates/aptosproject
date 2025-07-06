import { Batch } from "../lib/types";
import { useSupplyChainActions } from "../hooks/useSupplyChain";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";

interface BatchCardProps {
  batch: Batch;
  detailed?: boolean;
  onClick?: () => void;
  showApproveButton?: boolean;
}

export default function BatchCard({
  batch,
  detailed = false,
  onClick,
  showApproveButton = false,
}: BatchCardProps) {
  const { approveBatch } = useSupplyChainActions();
  const { account } = useWallet();
  const [isApproving, setIsApproving] = useState(false);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
  };

  const handleApprove = async () => {
    if (!account?.address) return;

    setIsApproving(true);
    try {
      await approveBatch(batch.owner, batch.id);
      alert("Batch approved successfully!");
      // Refresh the page or trigger a refresh
      window.location.reload();
    } catch (error: any) {
      console.error("Approval error:", error);
      alert("Failed to approve batch: " + error.message);
    } finally {
      setIsApproving(false);
    }
  };

  const productName = batch.productName || "Unknown Product";
  const productType = batch.productType || "Unknown Type";
  const originLocation = batch.originLocation || "Unknown Origin";
  const destination = batch.destination || "Unknown Destination";
  const currentLocation = batch.currentLocation || "Unknown Location";
  const status = batch.status || "unknown";

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md ${
        onClick ? "cursor-pointer hover:shadow-lg transition" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{productName}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            statusColors[status] || "bg-gray-100"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{productType}</p>
      <p className="mt-2">
        <span className="font-medium">Quantity:</span> {batch.quantity || 0}
      </p>

      {showApproveButton &&
        status === "pending" &&
        account?.address.toString() === batch.owner && (
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove();
              }}
              disabled={isApproving}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {isApproving ? "Approving..." : "Approve Batch"}
            </button>
          </div>
        )}

      {detailed && (
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-medium">Manufacturing Date:</span>{" "}
            {batch.manufacturingDate
              ? new Date(batch.manufacturingDate * 1000).toLocaleDateString()
              : "Unknown"}
          </p>
          <p>
            <span className="font-medium">Origin:</span> {originLocation}
          </p>
          <p>
            <span className="font-medium">Destination:</span> {destination}
          </p>
          <p>
            <span className="font-medium">Current Location:</span>{" "}
            {currentLocation}
          </p>

          {batch.tags && batch.tags.length > 0 && (
            <div>
              <span className="font-medium">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {batch.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {batch.documents && batch.documents.length > 0 && (
            <div>
              <span className="font-medium">Documents:</span>
              <ul className="list-disc list-inside mt-1">
                {batch.documents.map((doc, index) => (
                  <li key={index}>
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {doc.substring(0, 30)}...
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            Created:{" "}
            {batch.createdAt
              ? new Date(batch.createdAt * 1000).toLocaleString()
              : "Unknown"}
          </p>
        </div>
      )}
    </div>
  );
}
