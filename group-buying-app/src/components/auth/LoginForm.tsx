'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onLoginSuccess?: () => void; // Callback on successful login
  onSwitchToSignUp?: () => void; // Callback to switch to sign-up form
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    } else if (data.user) {
      // Login successful
      if (onLoginSuccess) onLoginSuccess();
      // Clear form or redirect
      setEmail('');
      setPassword('');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email-login" className="block text-lg font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email-login"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-lg font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password-login"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button
          type="submit"
          text={loading ? 'Logging In...' : 'Log In'}
          className="w-full"
          ariaLabel="Submit login form"
          disabled={loading}
        />
      </form>
      {onSwitchToSignUp && (
        <p className="mt-6 text-center text-md text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
            Sign Up
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
