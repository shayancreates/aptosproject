import { useState } from "react";
import { useSupplyChainActions } from "../hooks/useSupplyChain";
import { useSupplyChain } from "../context/SupplyChainContext";

export default function BatchCreationForm() {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantity: 0,
    originLocation: "",
    destination: "",
    tags: [] as string[],
    documents: [] as string[],
    phoneNotifications: "",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { registerBatch } = useSupplyChainActions();
  const { refreshData } = useSupplyChain();

  const sendNotification = async (phoneNumber: string, message: string) => {
    if (!phoneNumber) return;

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.productName.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.productType.trim()) {
      setError("Product type is required");
      return;
    }

    if (formData.quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!formData.originLocation.trim()) {
      setError("Origin location is required");
      return;
    }

    if (!formData.destination.trim()) {
      setError("Destination is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerBatch(formData);
      setSuccess(
        "Batch created successfully! It will appear in the batch lookup once approved."
      );

      if (formData.phoneNotifications) {
        const message = `New batch "${formData.productName}" created successfully. Status: Pending approval.`;
        await sendNotification(formData.phoneNotifications, message);
      }

      setFormData({
        productName: "",
        productType: "",
        quantity: 0,
        originLocation: "",
        destination: "",
        tags: [],
        documents: [],
        phoneNotifications: "",
      });

      await refreshData();
    } catch (error: any) {
      console.error("Batch creation error:", error);
      setError(error.message || "Failed to create batch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addDocument = () => {
    if (currentDoc && !formData.documents.includes(currentDoc)) {
      setFormData({
        ...formData,
        documents: [...formData.documents, currentDoc],
      });
      setCurrentDoc("");
    }
  };

  const removeDocument = (doc: string) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((d) => d !== doc),
    });
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Batch</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Type</label>
          <input
            type="text"
            value={formData.productType}
            onChange={(e) =>
              setFormData({ ...formData, productType: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 0,
              })
            }
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Origin Location
          </label>
          <input
            type="text"
            value={formData.originLocation}
            onChange={(e) =>
              setFormData({ ...formData, originLocation: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Documents</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentDoc}
              onChange={(e) => setCurrentDoc(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add document URL"
            />
            <button
              type="button"
              onClick={addDocument}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.documents.map((doc) => (
              <span
                key={doc}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.substring(0, 20)}...
                </a>
                <button
                  type="button"
                  onClick={() => removeDocument(doc)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Notifications (optional)
          </label>
          <input
            type="tel"
            value={formData.phoneNotifications}
            onChange={(e) =>
              setFormData({ ...formData, phoneNotifications: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="+1234567890"
          />
          <p className="text-xs text-gray-500 mt-1">
            You'll receive SMS notifications about batch status updates
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Batch"}
        </button>
      </form>
    </div>
  );
}
