'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';

interface AuthStatusProps {
  onShowLogin: () => void;
  onShowSignUp: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ onShowLogin, onShowSignUp }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // Optionally, you could trigger a page refresh or data re-fetch here if needed globally
      // For example, if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') window.location.reload();
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      alert(`Error logging out: ${error.message}`);
    }
    // Auth listener will handle setting user and session to null
    setLoading(false);
  };

  if (loading) {
    return <div className="text-white text-sm">Loading auth status...</div>;
  }

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <>
          <span className="text-white text-sm hidden sm:inline">Hi, {user.email?.split('@')[0]}</span>
          <Button
            text="Logout"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-xs sm:text-sm py-2 px-3 focus:ring-red-400"
            ariaLabel="Log out"
          />
        </>
      ) : (
        <>
          <Button
            text="Login"
            onClick={onShowLogin}
            className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm py-2 px-3 focus:ring-green-400"
            ariaLabel="Show login form"
          />
          <Button
            text="Sign Up"
            onClick={onShowSignUp}
            className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm py-2 px-3 focus:ring-blue-400"
            ariaLabel="Show sign up form"
          />
        </>
      )}
    </div>
  );
};

export default AuthStatus;
