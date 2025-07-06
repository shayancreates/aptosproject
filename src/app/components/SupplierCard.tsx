import { Batch } from "../lib/types";

interface SupplierCardProps {
  name: string;
  address: string;
  products: Batch[];
  onSelectBatch: (batch: Batch) => void;
}

export default function SupplierCard({
  name,
  address,
  products,
  onSelectBatch,
}: SupplierCardProps) {
  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 font-mono">{address}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Available Products:</h4>
        {products.length > 0 ? (
          products.map((product) => {
            const productName = product.productName || "Unknown Product";
            const productType = product.productType || "Unknown Type";
            const originLocation = product.originLocation || "Unknown Origin";
            const status = product.status || "unknown";
            return (
              <div
                key={product.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectBatch(product)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-800">{productName}</h5>
                    <p className="text-sm text-gray-600">{productType}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {product.quantity || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      Origin: {originLocation}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      status === "approved"
                        ? "bg-green-100 text-green-800"
                        : status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "in_transit"
                        ? "bg-blue-100 text-blue-800"
                        : status === "delivered"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-4">
            No products available from this supplier.
          </p>
        )}
      </div>
    </div>
  );
}
