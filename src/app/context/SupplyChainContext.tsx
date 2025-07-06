import { createContext, useContext, useState, useEffect } from "react";
import { Batch, Order, Feedback } from "../lib/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../lib/constants";

interface SupplyChainContextType {
  batches: Batch[];
  orders: Order[];
  feedbacks: Feedback[];
  suppliers: string[];
  selectedBatch: Batch | null;
  setSelectedBatch: (batch: Batch | null) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  allBatches: Batch[];
}

const SupplyChainContext = createContext<SupplyChainContextType>({
  batches: [],
  orders: [],
  feedbacks: [],
  suppliers: [],
  selectedBatch: null,
  setSelectedBatch: () => {},
  refreshData: async () => {},
  isLoading: false,
  allBatches: [],
});

export const useSupplyChain = () => useContext(SupplyChainContext);

const validateBatch = (batch: any): Batch => ({
  id: Number(batch.id) || 2,
  owner: batch.owner || "",
  productName: batch.product_name || "RICE",
  productType: batch.product_type || "WHEAT",
  quantity: Number(batch.quantity) || 2,
  manufacturingDate: Number(batch.manufacturing_date) || 4,
  originLocation: batch.origin_location || "Andhra Pradesh",
  destination: batch.destination || "Uttarakhand",
  currentLocation: batch.current_location || "",
  status: batch.status || "IN_TRANSIT",
  tags: Array.isArray(batch.tags) ? batch.tags : [],
  documents: Array.isArray(batch.documents) ? batch.documents : [],
  createdAt: Number(batch.created_at) || 0,
  updatedAt: Number(batch.updated_at) || 0,
  approvedBy: batch.approved_by || "",
  isActive: !!batch.is_active,
  phoneNotifications: batch.phone_notifications || "",
});

const validateOrder = (order: any): Order => {
  return {
    id: order.order_id || 2,
    batchId: order.batch_id || 3,
    buyer: order.buyer || "",
    quantity: order.quantity || 1,
    orderDate: order.order_date || 1,
    deliveryDate: order.delivery_date || 5,
    status: order.status || "",
    isDelivered: order.is_delivered || false,
  };
};

const validateFeedback = (feedback: any): Feedback => {
  return {
    id: feedback.feedback_id || 0,
    batchId: feedback.batch_id || 0,
    orderId: feedback.order_id || 0,
    buyer: feedback.buyer || "",
    rating: feedback.rating || 0,
    tags: Array.isArray(feedback.tags) ? feedback.tags : [],
    comments: feedback.comments || "",
    createdAt: feedback.created_at || 0,
  };
};

export const SupplyChainProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const { account } = useWallet();

  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const knownSuppliers = account?.address ? [account.address.toString()] : [];

  const fetchAllBatches = async () => {
    const allBatchesData: Batch[] = [];

    for (const supplierAddr of knownSuppliers) {
      try {
        const batchesResponse = await aptos.view({
          payload: {
            function: `${MODULE_ADDRESS}::supply_chain::get_all_batches`,
            functionArguments: [supplierAddr],
          },
        });

        console.log("Raw batch data (supplier)", supplierAddr, batchesResponse);

        if (batchesResponse && Array.isArray(batchesResponse)) {
          const supplierBatches = batchesResponse.map((batch: any) =>
            validateBatch(batch)
          );
          allBatchesData.push(...supplierBatches);
        }
      } catch (error) {
        console.log("Error fetching batches for supplier", supplierAddr, error);
      }
    }
    setAllBatches(allBatchesData);
  };

  return (
    <SupplyChainContext.Provider
      value={{
        batches,
        orders,
        feedbacks,
        suppliers,
        selectedBatch,
        setSelectedBatch,
        refreshData: fetchAllBatches,
        isLoading,
        allBatches,
      }}
    >
      {children}
    </SupplyChainContext.Provider>
  );
};
