'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/supabase';
import Button from '@/components/ui/Button';

interface CreateGroupBuyFormProps {
  product: Product;
  onSubmit: (formData: { target_quantity: number; ends_at: string }) => Promise<void>;
  onCancel: () => void;
}

const CreateGroupBuyForm: React.FC<CreateGroupBuyFormProps> = ({ product, onSubmit, onCancel }) => {
  const [targetQuantity, setTargetQuantity] = useState<number>(10); // Default target quantity
  const [endsAt, setEndsAt] = useState<string>(() => {
    const Tmrw = new Date();
    Tmrw.setDate(Tmrw.getDate() + 7); // Default to 7 days from now
    return Tmrw.toISOString().slice(0, 16); // Format for datetime-local input
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (new Date(endsAt) <= new Date()) {
      setError('End date must be in the future.');
      setIsLoading(false);
      return;
    }
    if (targetQuantity <= 0) {
      setError('Target quantity must be greater than 0.');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        target_quantity: targetQuantity,
        ends_at: new Date(endsAt).toISOString(), // Ensure full ISO string for Supabase
      });
    } catch (e: any) {
      setError(e.message || 'Failed to create group buy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Start Group Buy for: <span className="text-blue-600">{product.name}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="target_quantity" className="block text-lg font-medium text-gray-700 mb-1">
              Target Quantity
            </label>
            <input
              type="number"
              id="target_quantity"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(parseInt(e.target.value, 10))}
              min="1"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </div>
          <div>
            <label htmlFor="ends_at" className="block text-lg font-medium text-gray-700 mb-1">
              Ends At
            </label>
            <input
              type="datetime-local"
              id="ends_at"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Button
              type="button"
              text="Cancel"
              onClick={onCancel}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-200"
              ariaLabel="Cancel creating group buy"
              disabled={isLoading}
            />
            <Button
              type="submit"
              text={isLoading ? 'Creating...' : 'Create Group Buy'}
              className="w-full sm:w-auto"
              ariaLabel="Submit form to create group buy"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupBuyForm;
