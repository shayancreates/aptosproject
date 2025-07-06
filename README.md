# Aptos Supply Chain Management System

A decentralized supply chain management system built on Aptos blockchain with React/Next.js frontend and Move smart contracts. The system enables suppliers to create product batches, users to place orders, and includes WhatsApp notifications via Twilio.

## Features

- **Supplier Dashboard**: Create and manage product batches
- **User Dashboard**: Browse suppliers, place orders, and track deliveries
- **Blockchain Integration**: All data stored on Aptos blockchain
- **WhatsApp Notifications**: Real-time order updates via Twilio
- **Batch Tracking**: Monitor product location and temperature
- **Reputation System**: Track supplier performance and ratings
- **Real-time Updates**: Live data from blockchain

smart contract deployed: 0x5aa3600cea34f3bcfff601685047b12a8597ed47e05d5fd165c1b40c5cca573e

its on testnet

petra wallet is used

## Prerequisites

- Node.js 18+ and npm
- Aptos CLI
- Petra Wallet (or any Aptos wallet)
- Twilio Account (for WhatsApp notifications)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd aptosproject
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   GOOGLE_API_KEY=google-gemini-api-key
   NEXT_PUBLIC_MODULE_ADDRESS=0x5aa3600cea34f3bcfff601685047b12a8597ed47e05d5fd165c1b40c5cca573e

   ```

4. **Deploy the Move contract if needed**

   ```bash
   cd contracts
   aptos init --profile default
   aptos move compile --named-addresses supply_chain=default
   aptos move publish --named-addresses supply_chain=default
   ```



## Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **Connect your wallet**
   Use Petra Wallet or any Aptos wallet to connect to the application

## Usage

### For Suppliers

1. **Navigate to Supplier Dashboard**

   - Go to the main page or `/supplier`
   - Connect your wallet

2. **Initialize Account**

   - Click "Initialize Account" if this is your first time
   - This sets up your account on the blockchain

3. **Create Batches**

   - Fill in product details (name, type, quantity, origin, destination)
   - Add tags and documents
   - Submit the batch

4. **Manage Batches**
   - View all your batches in the Batch Lookup tab
   - Update batch status and location
   - Monitor orders and deliveries

### For Users

1. **Navigate to User Dashboard**

   - Go to `/user`
   - Connect your wallet

2. **Browse Suppliers**

   - View all available suppliers and their products
   - Filter by product type or location

3. **Place Orders**

   - Select a product from any supplier
   - Enter quantity and WhatsApp number
   - Confirm the order

4. **Track Orders**
   - Use the Order Tracker chatbot
   - Receive WhatsApp notifications for order updates

## Twilio WhatsApp Setup

1. **Create a Twilio Account**

   - Sign up at [twilio.com](https://twilio.com)
   - Get your Account SID and Auth Token

2. **Set up WhatsApp Sandbox**

   - Go to Twilio Console > Messaging > Try it out > Send a WhatsApp message
   - Follow the instructions to join the sandbox
   - Note your Twilio WhatsApp number

3. **Configure Environment Variables**

   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   ```

4. **Test Notifications**
   - Place an order with a WhatsApp number
   - You should receive a confirmation message

## Smart Contract Functions

### Core Functions

- `initialize_supply_chain()`: Initialize a user's account
- `register_batch()`: Create a new product batch
- `create_order()`: Place an order for a batch
- `update_batch_status()`: Update batch location and status
- `mark_order_delivered()`: Mark order as delivered
- `submit_feedback()`: Submit feedback for delivered orders

### View Functions

- `get_all_batches()`: Get all batches for a supplier
- `get_all_orders()`: Get all orders for a user
- `get_batch_events()`: Get events for a specific batch



## Troubleshooting

### Common Issues

1. **"ENOT_INITIALIZED" Error**

   - Make sure to initialize your account before creating batches
   - Check if the module address is correct


2. **WhatsApp Notifications Not Working**

   - Verify Twilio credentials in environment variables
   - Check if the phone number format is correct (+country code)
   - Ensure the user has joined the Twilio WhatsApp sandbox

3. **Wallet Connection Issues**
   - Make sure you're using a compatible Aptos wallet
   - Check if you're connected to the correct network (Testnet)

##
