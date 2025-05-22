-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Group Buys Table
CREATE TABLE group_buys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    target_quantity INTEGER NOT NULL,
    current_quantity INTEGER DEFAULT 0,
    creator_id UUID NOT NULL REFERENCES auth.users(id),
    status TEXT DEFAULT 'active', -- e.g., 'active', 'successful', 'failed', 'expired'
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security for group_buys
ALTER TABLE group_buys ENABLE ROW LEVEL SECURITY;

-- Participants Table
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_buy_id UUID NOT NULL REFERENCES group_buys(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    quantity_joined INTEGER NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (group_buy_id, user_id)
);

-- Enable Row Level Security for participants
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints after table creation
-- This is just to be sure, as REFERENCES already creates them.
-- ALTER TABLE group_buys ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id);
-- ALTER TABLE group_buys ADD CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES auth.users(id);
-- ALTER TABLE participants ADD CONSTRAINT fk_group_buy FOREIGN KEY (group_buy_id) REFERENCES group_buys(id);
-- ALTER TABLE participants ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Note: Policies for RLS are not defined here as they depend on application logic.
-- Basic policies would be needed to allow users to interact with the data.
-- For example:
-- CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
-- CREATE POLICY "Allow users to insert their own group buys" ON group_buys FOR INSERT WITH CHECK (auth.uid() = creator_id);
-- CREATE POLICY "Allow users to view group buys" ON group_buys FOR SELECT USING (true);
-- CREATE POLICY "Allow users to join group buys" ON participants FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Allow users to view their participations" ON participants FOR SELECT USING (auth.uid() = user_id);
