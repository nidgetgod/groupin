import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard'; // Adjust path as necessary
import type { Product } from '@/types/supabase'; // Import Product type

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />; // Render a basic img tag for testing
  },
}));

// Mock Button component used within ProductCard
jest.mock('./Button', () => {
    const ButtonMock = ({ text, onClick, ariaLabel, disabled }: { text: string, onClick: () => void, ariaLabel?: string, disabled?: boolean }) => (
      <button onClick={onClick} aria-label={ariaLabel || text} disabled={disabled}>
        {text}
      </button>
    );
    ButtonMock.displayName = 'ButtonMock';
    return ButtonMock;
  });

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: 'prod_123',
    name: 'Organic Apples',
    description: 'A box of fresh, locally sourced organic apples.',
    price: 25.99,
    image_url: 'https://example.com/apples.jpg',
    created_at: new Date().toISOString(),
  };

  const mockOnStartGroupBuy = jest.fn();

  beforeEach(() => {
    mockOnStartGroupBuy.mockClear();
  });

  test('renders product name', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  test('renders product description', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    expect(screen.getByText(mockProduct.description!)).toBeInTheDocument(); // Using non-null assertion as description is provided
  });

  test('renders product price formatted correctly', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    expect(screen.getByText(`Price: $${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
  });

  test('renders product image if image_url is provided', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    const imageElement = screen.getByRole('img', { name: mockProduct.name });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockProduct.image_url);
  });

  test('does not render image if image_url is not provided', () => {
    const productWithoutImage = { ...mockProduct, image_url: null };
    render(<ProductCard product={productWithoutImage} onStartGroupBuy={mockOnStartGroupBuy} />);
    expect(screen.queryByRole('img', { name: mockProduct.name })).not.toBeInTheDocument();
  });
  
  test('renders "Start Group Buy" button', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    // The mock Button renders a native button element
    const startButton = screen.getByRole('button', { name: `Start a group buy for ${mockProduct.name}` });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveTextContent('Start Group Buy');
  });

  test('calls onStartGroupBuy with the product when "Start Group Buy" button is clicked', () => {
    render(<ProductCard product={mockProduct} onStartGroupBuy={mockOnStartGroupBuy} />);
    const startButton = screen.getByRole('button', { name: `Start a group buy for ${mockProduct.name}` });
    
    fireEvent.click(startButton);
    
    expect(mockOnStartGroupBuy).toHaveBeenCalledTimes(1);
    expect(mockOnStartGroupBuy).toHaveBeenCalledWith(mockProduct);
  });

   test('handles product with no description gracefully', () => {
    const productWithoutDescription = { ...mockProduct, description: null };
    render(<ProductCard product={productWithoutDescription} onStartGroupBuy={mockOnStartGroupBuy} />);
    expect(screen.getByText(productWithoutDescription.name)).toBeInTheDocument();
    // Check that description is not present or handled (e.g., an empty p tag, or just not there)
    // Depending on implementation, this might mean the p tag for description is absent or empty.
    // If the <p> tag is always rendered, check for empty content.
    // If it's conditionally rendered, queryByText for the description should be null.
    expect(screen.queryByText(mockProduct.description!)).not.toBeInTheDocument(); 
  });
});
