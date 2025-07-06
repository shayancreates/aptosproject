import { useSupplyChain } from "../context/SupplyChainContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../lib/constants";

export const useSupplyChainActions = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { refreshData } = useSupplyChain();

  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const initializeSupplyChain = async () => {
    if (!account) throw new Error("Wallet not connected");

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::initialize_supply_chain`,
        typeArguments: [],
        functionArguments: [],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    return response.hash;
  };

  const registerBatch = async (batchData: any) => {
    if (!account) throw new Error("Wallet not connected");

    // First, try to initialize if not already initialized
    try {
      await initializeSupplyChain();
    } catch (error: any) {
      // If already initialized, this will fail, which is fine
      console.log("Account may already be initialized:", error.message);
    }

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::register_batch`,
        typeArguments: [],
        functionArguments: [
          batchData.productName,
          batchData.productType,
          batchData.quantity.toString(),
          Math.floor(Date.now() / 1000).toString(), // manufacturing_date
          batchData.originLocation,
          batchData.destination,
          batchData.tags,
          batchData.documents,
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  const createOrder = async (ownerAddr: string, batchId: number, quantity: number) => {
    if (!account) throw new Error("Wallet not connected");

    // Ensure buyer is initialized
    try {
      await initializeSupplyChain();
    } catch (error: any) {
      // If already initialized, this will fail, which is fine
      console.log("Buyer account may already be initialized:", error.message);
    }

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::create_order`,
        typeArguments: [],
        functionArguments: [
          ownerAddr,
          batchId.toString(),
          quantity.toString(),
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  const submitFeedback = async (feedbackData: any) => {
    if (!account) throw new Error("Wallet not connected");

    // Ensure user is initialized
    try {
      await initializeSupplyChain();
    } catch (error: any) {
      // If already initialized, this will fail, which is fine
      console.log("Account may already be initialized:", error.message);
    }

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::submit_feedback`,
        typeArguments: [],
        functionArguments: [
          feedbackData.ownerAddr || account.address,
          feedbackData.orderId.toString(),
          feedbackData.rating.toString(),
          feedbackData.tags,
          feedbackData.comments,
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  const updateBatchStatus = async (ownerAddr: string, batchId: number, newStatus: string, newLocation: string, notes: string) => {
    if (!account) throw new Error("Wallet not connected");

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::update_batch_status`,
        typeArguments: [],
        functionArguments: [
          ownerAddr,
          batchId.toString(),
          newStatus,
          newLocation,
          notes,
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  const approveBatch = async (ownerAddr: string, batchId: number) => {
    if (!account) throw new Error("Wallet not connected");

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::approve_batch`,
        typeArguments: [],
        functionArguments: [
          ownerAddr,
          batchId.toString(),
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  const markOrderDelivered = async (orderId: number) => {
    if (!account) throw new Error("Wallet not connected");

    const response = await signAndSubmitTransaction({
      data: {
        function: `${MODULE_ADDRESS}::supply_chain::mark_order_delivered`,
        typeArguments: [],
        functionArguments: [
          orderId.toString(),
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
    await refreshData();
    return response.hash;
  };

  return { 
    registerBatch, 
    createOrder, 
    submitFeedback, 
    initializeSupplyChain,
    updateBatchStatus,
    approveBatch,
    markOrderDelivered
  };
};
