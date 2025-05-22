import React from 'react';
import Image from 'next/image';
import Button from './Button'; // Import Button component
import type { Product } from '@/types/supabase'; // Import Product type

interface ProductCardProps {
  product: Product;
  onStartGroupBuy: (product: Product) => void; // Callback for starting a group buy
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onStartGroupBuy }) => {
  const { name, description, price, image_url } = product;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 border border-gray-200 flex flex-col justify-between">
      <div>
        {image_url && (
          <div className="relative h-48 w-full mb-4">
            <Image src={image_url} alt={name} layout="fill" objectFit="cover" className="rounded-md" />
          </div>
        )}
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{name}</h3>
        {description && <p className="text-gray-600 text-lg mb-3">{description}</p>}
        <p className="text-xl font-bold text-green-600 mb-4">Price: ${price.toFixed(2)}</p>
      </div>
      <Button
        text="Start Group Buy"
        onClick={() => onStartGroupBuy(product)}
        className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-orange-400"
        ariaLabel={`Start a group buy for ${name}`}
      />
    </div>
  );
};

export default ProductCard;
