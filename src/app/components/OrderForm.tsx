import { useState } from "react";
import { useSupplyChainActions } from "../hooks/useSupplyChain";
import { Batch } from "../lib/types";

interface OrderFormProps {
  batch: Batch;
  onBack: () => void;
  onOrderSuccess: () => void;
}

export default function OrderForm({
  batch,
  onBack,
  onOrderSuccess,
}: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createOrder } = useSupplyChainActions();

  const productName = batch.productName || "Unknown Product";
  const productType = batch.productType || "Unknown Type";
  const originLocation = batch.originLocation || "Unknown Origin";
  const destination = batch.destination || "Unknown Destination";
  const status = batch.status || "unknown";
  const availableQuantity = batch.quantity || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0 || quantity > availableQuantity) {
      setError("Invalid quantity. Please enter a valid amount.");
      return;
    }

    if (status !== "approved") {
      setError("This batch is not yet approved for ordering.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder(batch.owner, batch.id, quantity);
      alert("Order created successfully!");
      onOrderSuccess();
    } catch (error: any) {
      console.error("Order creation error:", error);
      setError(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">
        ← Back to suppliers
      </button>

      <h2 className="text-xl font-bold mb-4">Place Order</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Product Details</h3>
        <p>
          <span className="font-medium">Name:</span> {productName}
        </p>
        <p>
          <span className="font-medium">Type:</span> {productType}
        </p>
        <p>
          <span className="font-medium">Available Quantity:</span>{" "}
          {availableQuantity}
        </p>
        <p>
          <span className="font-medium">Origin:</span> {originLocation}
        </p>
        <p>
          <span className="font-medium">Destination:</span> {destination}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "approved"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Order Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="1"
            max={availableQuantity}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum available: {availableQuantity}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              quantity <= 0 ||
              quantity > availableQuantity ||
              status !== "approved"
            }
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
