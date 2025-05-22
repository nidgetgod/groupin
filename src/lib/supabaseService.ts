import { supabase } from './supabaseClient';
import type { Product, GroupBuy, CreateGroupBuyData, GroupBuyWithProduct, Participant } from '@/types/supabase';

// 1. Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }
  return data || [];
};

// 2. Fetch all active group buys with product details
export const getActiveGroupBuys = async (): Promise<GroupBuyWithProduct[]> => {
  const { data, error } = await supabase
    .from('group_buys')
    .select(`
      *,
      products (*)
    `)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching active group buys:', error);
    throw new Error(error.message);
  }
  // Supabase types might not automatically match GroupBuyWithProduct if products is null
  // Casting here, ensure your RLS allows fetching products for group buys
  return (data as GroupBuyWithProduct[] || []).filter(gb => gb.products); // Ensure product data is present
};

// 3. Create a new group buy
export const createGroupBuy = async (groupBuyData: Omit<CreateGroupBuyData, 'creator_id'>, userId: string): Promise<GroupBuy> => {
  const fullGroupBuyData: CreateGroupBuyData = {
    ...groupBuyData,
    creator_id: userId,
  };
  const { data, error } = await supabase
    .from('group_buys')
    .insert([fullGroupBuyData])
    .select()
    .single(); // Assuming you want the created record back

  if (error) {
    console.error('Error creating group buy:', error);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Group buy creation did not return data.');
  }
  return data;
};

// 4. Join a group buy
// For MVP, separate calls. Note: This is not atomic.
// A Supabase Edge Function would be better for atomicity (update current_quantity & insert participant).
export const joinGroupBuy = async (groupBuyId: string, userId: string, quantity: number): Promise<Participant> => {
  // Step 1: Get current group buy to check target_quantity and current_quantity
  const { data: groupBuy, error: fetchError } = await supabase
    .from('group_buys')
    .select('current_quantity, target_quantity')
    .eq('id', groupBuyId)
    .single();

  if (fetchError || !groupBuy) {
    console.error('Error fetching group buy details for joining:', fetchError);
    throw new Error(fetchError?.message || 'Group buy not found.');
  }

  if (groupBuy.current_quantity + quantity > groupBuy.target_quantity) {
    throw new Error('Joining this quantity would exceed the target quantity.');
  }

  // Step 2: Create the participant record
  const { data: participant, error: participantError } = await supabase
    .from('participants')
    .insert([
      {
        group_buy_id: groupBuyId,
        user_id: userId,
        quantity_joined: quantity,
      },
    ])
    .select()
    .single();

  if (participantError) {
    console.error('Error joining group buy (creating participant):', participantError);
    throw new Error(participantError.message);
  }
  if (!participant) {
    throw new Error('Participant record creation failed.');
  }

  // Step 3: Update the current_quantity in the group_buys table
  const newQuantity = groupBuy.current_quantity + quantity;
  const { error: updateError } = await supabase
    .from('group_buys')
    .update({ current_quantity: newQuantity })
    .eq('id', groupBuyId);

  if (updateError) {
    console.error('Error updating group buy quantity:', updateError);
    // Potentially roll back participant creation here if critical, or handle via cron/cleanup.
    // For now, just log and throw. The participant record was still created.
    throw new Error(updateError.message);
  }

  return participant;
};

// Utility to get a user ID - replace with actual auth later
export const getPlaceholderUserId = (): string => {
  // This should be replaced with actual user ID from Supabase Auth
  // For now, using a hardcoded placeholder UUID.
  // You can generate a new one or use a known one from your auth.users table for testing.
  // This function is now removed as user ID will come from auth state.
// };
