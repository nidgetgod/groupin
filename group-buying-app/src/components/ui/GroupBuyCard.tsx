import React from 'react';
import Button from './Button'; // Import Button component
import type { GroupBuyWithProduct } from '@/types/supabase'; // Import GroupBuyWithProduct type
import Image from 'next/image';

interface GroupBuyCardProps {
  groupBuy: GroupBuyWithProduct;
  onJoinGroupBuy: (groupBuyId: string, quantity: number) => void; // Callback for joining a group buy
}

// Helper to format date/time remaining
const formatTimeRemaining = (endsAt: string): string => {
  const now = new Date();
  const endDate = new Date(endsAt);
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
};

const GroupBuyCard: React.FC<GroupBuyCardProps> = ({ groupBuy, onJoinGroupBuy }) => {
  const { products: product, current_quantity, target_quantity, ends_at, id: groupBuyId } = groupBuy;
  const progressPercentage = Math.min((current_quantity / target_quantity) * 100, 100);
  const timeRemaining = formatTimeRemaining(ends_at);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 border border-gray-200 flex flex-col justify-between">
      <div>
        {product.image_url && (
          <div className="relative h-40 w-full mb-3">
            <Image src={product.image_url} alt={product.name} layout="fill" objectFit="cover" className="rounded-md" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Group Buy: {product.name}</h3>
        <p className="text-md text-gray-600 mb-1">Original Price: ${product.price.toFixed(2)}</p>
        {/* Potential discounted price could be shown here if applicable */}

        <div className="my-3">
          <div className="flex justify-between text-md text-gray-700 mb-1">
            <span>Participants:</span>
            <span>{current_quantity} / {target_quantity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className="bg-blue-500 h-5 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
        </div>
        <p className={`text-md font-semibold ${timeRemaining === 'Ended' ? 'text-gray-500' : 'text-red-500'}`}>
          Time Remaining: {timeRemaining}
        </p>
      </div>
      <Button
        text="Join Group Buy (1)"
        onClick={() => onJoinGroupBuy(groupBuyId, 1)} // Default quantity of 1 for now
        className="w-full mt-4 bg-teal-500 hover:bg-teal-600 focus:ring-teal-400"
        ariaLabel={`Join group buy for ${product.name}`}
        disabled={timeRemaining === 'Ended' || current_quantity >= target_quantity}
      />
    </div>
  );
};

export default GroupBuyCard;
