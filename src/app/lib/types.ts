export interface Batch {
  id: number;
  owner: string;
  productName: string;
  productType: string;
  quantity: number;
  manufacturingDate: number;
  originLocation: string;
  destination: string;
  currentLocation: string;
  status: string;
  tags: string[];
  documents: string[];
  createdAt: number;
  updatedAt: number;
  approvedBy: string;
  isActive: boolean;
  phoneNotifications: string;
}

export interface Order {
  id: number;
  batchId: number;
  buyer: string;
  quantity: number;
  orderDate: number;
  deliveryDate: number;
  status: string;
  isDelivered: boolean;
}

export interface Feedback {
  id: number;
  batchId: number;
  orderId: number;
  buyer: string;
  rating: number;
  tags: string[];
  comments: string;
  createdAt: number;
}

export interface BatchEvent {
  batchId: number;
  eventType: string;
  location: string;
  timestamp: number;
  notes: string;
  temperature?: number;
  humidity?: number;
  quantity?: number;
}

export interface ActorReputation {
  address: string;
  score: number;
  successful_deliveries: number;
  disputes: number;
}

export interface ProductBatch {
  id: string;
  owner: string;
  product_name: string;
  product_type: string;
  quantity: number;
  manufacturing_date: number;
  origin_location: string;
  destination: string;
  current_location: string;
  status: string;
  tags: string[];
  documents: string[];
  created_at: number;
  updated_at: number;
  approved_by: string;
  is_active: boolean;
  events?: BatchEvent[];
}
