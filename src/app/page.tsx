'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from "@/components/ui/ProductCard";
import GroupBuyCard from "@/components/ui/GroupBuyCard";
import Button from "@/components/ui/Button";
import CreateGroupBuyForm from '@/components/forms/CreateGroupBuyForm';
import Header from '@/components/ui/Header'; // Import Header
import LoginForm from '@/components/auth/LoginForm'; // Import LoginForm
import SignUpForm from '@/components/auth/SignUpForm'; // Import SignUpForm
import { supabase } from '@/lib/supabaseClient'; // Import supabase client directly for auth
import { getProducts, getActiveGroupBuys, createGroupBuy, joinGroupBuy } from '@/lib/supabaseService';
import type { Product, GroupBuyWithProduct } from '@/types/supabase';
import type { User, Session } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [groupBuys, setGroupBuys] = useState<GroupBuyWithProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingGroupBuys, setLoadingGroupBuys] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateGroupBuyForm, setShowCreateGroupBuyForm] = useState(false);
  const [selectedProductForForm, setSelectedProductForForm] = useState<Product | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Auth state listener
  useEffect(() => {
    const fetchInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      // Initial data fetch can happen after session is known, or be independent if public data
    };
    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // If user logs in or out, might want to re-fetch data or clear sensitive data
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        fetchAllData(); // Re-fetch data on auth change
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);


  const fetchAllData = useCallback(async () => {
    setLoadingProducts(true);
    setLoadingGroupBuys(true);
    setError(null);
    try {
      const [productsData, groupBuysData] = await Promise.all([
        getProducts(),
        getActiveGroupBuys()
      ]);
      setProducts(productsData);
      setGroupBuys(groupBuysData);
    } catch (e: any) {
      console.error("Error fetching data:", e);
      setError(e.message || "Failed to fetch data. Check RLS policies for read access.");
    } finally {
      setLoadingProducts(false);
      setLoadingGroupBuys(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(); // Initial data fetch
  }, [fetchAllData]);

  // Modal handlers
  const handleShowLoginModal = () => { setShowLoginModal(true); setShowSignUpModal(false); };
  const handleShowSignUpModal = () => { setShowSignUpModal(true); setShowLoginModal(false); };
  const handleCloseAuthModals = () => { setShowLoginModal(false); setShowSignUpModal(false); };


  const handleStartGroupBuy = (product: Product) => {
    if (!user) {
      alert('Please log in to start a group buy.');
      handleShowLoginModal();
      return;
    }
    setSelectedProductForForm(product);
    setShowCreateGroupBuyForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateGroupBuyForm(false);
    setSelectedProductForForm(null);
  };

  const handleCreateGroupBuySubmit = async (formData: { target_quantity: number; ends_at: string }) => {
    if (!selectedProductForForm || !user) {
      alert('User or product not selected. Please log in and try again.');
      return;
    }

    try {
      // Pass Omit<CreateGroupBuyData, 'creator_id'> and userId
      await createGroupBuy({
        product_id: selectedProductForForm.id,
        target_quantity: formData.target_quantity,
        ends_at: formData.ends_at,
      }, user.id);
      alert('Group buy created successfully!');
      handleCloseCreateForm();
      setLoadingGroupBuys(true);
      const groupBuysData = await getActiveGroupBuys();
      setGroupBuys(groupBuysData);
    } catch (e: any) {
      console.error('Error creating group buy:', e);
      alert(`Failed to create group buy: ${e.message}. Ensure RLS allows insert for authenticated users.`);
      throw e;
    } finally {
      setLoadingGroupBuys(false);
    }
  };

  const handleJoinGroupBuy = async (groupBuyId: string, quantity: number) => {
    if (!user) {
      alert('Please log in to join a group buy.');
      handleShowLoginModal();
      return;
    }
    try {
      await joinGroupBuy(groupBuyId, user.id, quantity);
      alert('Successfully joined group buy!');
      setLoadingGroupBuys(true);
      const groupBuysData = await getActiveGroupBuys();
      setGroupBuys(groupBuysData);
    } catch (e: any) {
      console.error('Error joining group buy:', e);
      alert(`Failed to join group buy: ${e.message}. Ensure RLS allows insert for authenticated users.`);
    } finally {
      setLoadingGroupBuys(false);
    }
  };

  return (
    <>
      <Header onShowLogin={handleShowLoginModal} onShowSignUp={handleShowSignUpModal} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* Auth Modals */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <LoginForm onLoginSuccess={handleCloseAuthModals} onSwitchToSignUp={() => { handleCloseAuthModals(); handleShowSignUpModal(); }} />
          </div>
        )}
        {showSignUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <SignUpForm onSignUpSuccess={handleCloseAuthModals} onSwitchToLogin={() => { handleCloseAuthModals(); handleShowLoginModal(); }} />
          </div>
        )}

        <section className="text-center pt-8"> {/* Adjusted padding since Header is now part of page */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">Welcome to Community Buys!</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Discover products, start or join group buys, and save together.
          </p>
          <Button text="Reload All Data" onClick={fetchAllData} ariaLabel="Reload product and group buy data" className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500" />
        </section>

        {error && (
          <section className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
            <h3 className="font-bold text-lg">Error Occurred:</h3>
            <p className="text-md">{error}</p>
            <p className="text-sm mt-2">Please ensure RLS policies are correctly set for read access (and write for authenticated users). Also, check your Supabase email auth settings (e.g., email confirmation) in the Supabase dashboard.</p>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Available Products</h2>
          {loadingProducts ? (
            <p className="text-lg text-gray-600">Loading products...</p>
          ) : products.length === 0 && !error ? (
            <p className="text-lg text-gray-600">No products available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onStartGroupBuy={user ? handleStartGroupBuy : () => { alert('Please log in to start a group buy.'); handleShowLoginModal();}}
                  // Button inside ProductCard could be disabled or text changed if user is null
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Active Group Buys</h2>
          {loadingGroupBuys ? (
            <p className="text-lg text-gray-600">Loading group buys...</p>
          ) : groupBuys.length === 0 && !error ? (
            <p className="text-lg text-gray-600">No active group buys currently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {groupBuys.map((groupBuy) => (
                <GroupBuyCard
                  key={groupBuy.id}
                  groupBuy={groupBuy}
                  onJoinGroupBuy={user ? handleJoinGroupBuy : () => { alert('Please log in to join this group buy.'); handleShowLoginModal(); }}
                  // Button inside GroupBuyCard could be disabled or text changed if user is null
                />
              ))}
            </div>
          )}
        </section>

        {showCreateGroupBuyForm && selectedProductForForm && user && ( // Ensure user is logged in to see this form
          <CreateGroupBuyForm
            product={selectedProductForForm}
            onSubmit={handleCreateGroupBuySubmit}
            onCancel={handleCloseCreateForm}
          />
        )}

        {!user && (loadingProducts || loadingGroupBuys) && (
            <p className="text-center text-gray-600 text-lg mt-4">Loading data... Please log in to interact.</p>
        )}
      </div>
    </>
  );
}
