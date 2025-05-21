// Corresponds to the 'products' table
export interface Product {
  id: string; // UUID
  name: string;
  description?: string | null;
  image_url?: string | null;
  price: number;
  created_at?: string; // TIMESTAMPTZ
}

// Corresponds to the 'group_buys' table
export interface GroupBuy {
  id: string; // UUID
  product_id: string; // Foreign key to products
  target_quantity: number;
  current_quantity: number;
  creator_id: string; // Foreign key to auth.users
  status: 'active' | 'successful' | 'failed' | 'expired';
  ends_at: string; // TIMESTAMPTZ
  created_at?: string; // TIMESTAMPTZ
}

// Extended GroupBuy that includes product details
export interface GroupBuyWithProduct extends GroupBuy {
  products: Product; // Supabase returns related record as an object or array
}

// Corresponds to the 'participants' table
export interface Participant {
  id: string; // UUID
  group_buy_id: string; // Foreign key to group_buys
  user_id: string; // Foreign key to auth.users
  quantity_joined: number;
  joined_at?: string; // TIMESTAMPTZ
}

// For creating a new group buy
export interface CreateGroupBuyData {
  product_id: string;
  target_quantity: number;
  ends_at: string; // ISO string for TIMESTAMPTZ
  creator_id: string; // This will be auth.uid() eventually
}
