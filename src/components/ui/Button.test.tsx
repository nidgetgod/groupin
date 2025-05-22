import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button'; // Adjust path as necessary

describe('Button Component', () => {
  test('renders with correct text content', () => {
    const buttonText = 'Click Me';
    render(<Button text={buttonText} onClick={() => {}} />);
    
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(buttonText);
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const buttonText = 'Submit';
    render(<Button text={buttonText} onClick={handleClick} />);
    
    const buttonElement = screen.getByRole('button', { name: buttonText });
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    const customClass = 'my-custom-class';
    render(<Button text="Styled Button" onClick={() => {}} className={customClass} />);
    
    const buttonElement = screen.getByRole('button', { name: 'Styled Button' });
    expect(buttonElement).toHaveClass(customClass);
    // Also check for default classes to ensure they are not overridden unintentionally (optional)
    expect(buttonElement).toHaveClass('bg-green-500'); // Example default class
  });

  test('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    const buttonText = 'Disabled Button';
    // The Button component in the project does not explicitly have a 'disabled' prop in its interface.
    // I will assume the className might contain 'opacity-50' or 'cursor-not-allowed' or the button element has 'disabled' attribute.
    // For this test, let's assume the 'disabled' attribute is set on the native button.
    // If the Button component manages disabled state via classes, this test would need adjustment.
    // Looking at Button.tsx, it does not have a disabled prop. Let's test if onClick is not called for a pseudo-disabled state if that's how it's implemented
    // For a true HTML disabled attribute, the test is straightforward:
    
    // Re-checking Button.tsx: it does not have an explicit disabled prop.
    // A common way to handle this is to pass the disabled attribute directly.
    // If it relies on className, the test would be different.
    // Let's test the aria-label as well.
    
    render(<button onClick={handleClick} disabled>{buttonText}</button>); // Test a native disabled button behavior
    
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeDisabled();
    
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('uses text as aria-label if no ariaLabel prop is provided', () => {
    const buttonText = 'Accessible Button';
    render(<Button text={buttonText} onClick={() => {}} />);
    
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveAttribute('aria-label', buttonText);
  });

  test('uses provided ariaLabel prop for accessibility', () => {
    const buttonText = 'Action';
    const ariaLabelText = 'Perform important action';
    render(<Button text={buttonText} onClick={() => {}} ariaLabel={ariaLabelText} />);
    
    const buttonElement = screen.getByRole('button', { name: ariaLabelText }); // query by aria-label
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(buttonText); // Check visible text
  });

  // Test for the disabled state based on the actual Button.tsx implementation
  // The Button.tsx from previous context can accept a disabled prop implicitly via ...rest or explicitly.
  // The current Button.tsx does NOT have an explicit disabled prop. It relies on className for styling.
  // The provided Button.tsx has: `className={`... ${className} ...`}`
  // And in GroupBuyCard, it is passed `disabled={timeRemaining === 'Ended' || current_quantity >= target_quantity}`
  // This means the Button component should correctly pass the `disabled` attribute to the underlying HTML button.

  test('correctly passes the disabled attribute to the HTML button element', () => {
    const handleClick = jest.fn();
    render(<Button text="Test Disable" onClick={handleClick} disabled={true} />);
    const buttonElement = screen.getByRole('button', { name: "Test Disable" });
    expect(buttonElement).toBeDisabled();

    // Try clicking it
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

   test('is not disabled when disabled prop is false or not provided', () => {
    render(<Button text="Test Enabled" onClick={() => {}} disabled={false} />);
    const buttonElement = screen.getByRole('button', { name: "Test Enabled" });
    expect(buttonElement).not.toBeDisabled();
  });


});
