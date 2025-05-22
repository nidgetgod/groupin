'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';

interface SignUpFormProps {
  onSignUpSuccess?: () => void; // Callback on successful sign-up
  onSwitchToLogin?: () => void; // Callback to switch to login form
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user?.identities?.length === 0) {
      // This can happen if email confirmation is required but user already exists without confirmation.
      // Or if user exists and is confirmed. Supabase might return a user but with no session.
      setError("User already exists or confirmation required. Try logging in or check your email.");
    } else if (data.user) {
      setMessage('Sign up successful! Please check your email for a confirmation link if required by your Supabase setup.');
      if (onSignUpSuccess) onSignUpSuccess();
      // Clear form
      setEmail('');
      setPassword('');
    } else {
      setError('An unexpected error occurred during sign up.');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-5">
        <div>
          <label htmlFor="email-signup" className="block text-lg font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email-signup"
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
          <label htmlFor="password-signup" className="block text-lg font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password-signup"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        <Button
          type="submit"
          text={loading ? 'Signing Up...' : 'Sign Up'}
          className="w-full"
          ariaLabel="Submit sign up form"
          disabled={loading}
        />
      </form>
      {onSwitchToLogin && (
        <p className="mt-6 text-center text-md text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
            Log In
          </button>
        </p>
      )}
    </div>
  );
};

export default SignUpForm;
