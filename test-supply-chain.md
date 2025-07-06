# Supply Chain Test Guide

## Prerequisites
1. Make sure you have a wallet connected (Petra, Martian, etc.)
2. Ensure you have some test APT tokens for gas fees
3. The Move contract should be deployed to the testnet

## Test Scenarios

### 1. Supplier Creates a Batch
1. Navigate to the supplier page (`/supplier`)
2. Connect your wallet
3. Go to "Create Batch" tab
4. Fill in the form:
   - Product Name: "Organic Coffee"
   - Product Type: "Beverage"
   - Quantity: 1000
   - Origin Location: "Colombia"
   - Destination: "USA"
   - Tags: ["organic", "fair-trade"]
   - Documents: ["certificate1.pdf"]
   - Phone Notifications: "+1234567890" (optional)
5. Click "Create Batch"
6. **Expected Result**: Batch should be created and appear in the batch lookup

### 2. Batch Approval
1. Go to "Batch Lookup" tab
2. Find your created batch (should show as "pending")
3. Click on the batch to view details
4. Click "Approve Batch" button (only visible to batch owner)
5. **Expected Result**: Batch status should change to "approved"

### 3. User Places Order
1. Navigate to the user page (`/user`)
2. Connect a different wallet (buyer)
3. You should see the approved batch in the suppliers list
4. Click on the batch to place an order
5. Enter quantity (less than available)
6. Click "Place Order"
7. **Expected Result**: Order should be created successfully

### 4. Batch Lookup Verification
1. Go to the main page (`/`)
2. Navigate to "Batch Lookup" tab
3. You should see all batches from all suppliers
4. Filter by status to see pending vs approved batches
5. **Expected Result**: All batches should be visible and properly categorized

## Common Issues and Solutions

### Issue: Batches not appearing after creation
**Solution**: 
- Check if the wallet is properly connected
- Verify the transaction was successful on the blockchain
- Try refreshing the page or clicking "Refresh Data"

### Issue: Order creation fails
**Solution**:
- Ensure the batch is approved (status should be "approved")
- Make sure the buyer wallet is initialized
- Check that the quantity is valid (not exceeding available amount)

### Issue: Cannot approve batch
**Solution**:
- Ensure you're using the same wallet that created the batch
- Check if the batch status is "pending"
- Verify the transaction was successful

## Debugging Tips

1. **Check Browser Console**: Look for any JavaScript errors
2. **Check Network Tab**: Verify API calls are successful
3. **Check Wallet**: Ensure wallet is connected and has sufficient balance
4. **Check Blockchain Explorer**: Verify transactions on Aptos testnet explorer

## Expected Data Flow

1. **Supplier creates batch** → Batch stored on blockchain with "pending" status
2. **Supplier approves batch** → Batch status changes to "approved"
3. **User sees approved batch** → Batch appears in user interface
4. **User places order** → Order created and linked to batch
5. **Data refreshes** → All components show updated information

## Testing Checklist

- [ ] Wallet connection works
- [ ] Batch creation succeeds
- [ ] Batch appears in lookup
- [ ] Batch approval works
- [ ] User can see approved batches
- [ ] Order placement works
- [ ] Data refreshes properly
- [ ] Error handling works
- [ ] Notifications work (if phone number provided) 