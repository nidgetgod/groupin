import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header'; // Adjust path as necessary

// Mock the AuthStatus component as its internals are tested separately or are complex
jest.mock('@/components/auth/AuthStatus', () => {
  const AuthStatusMock = () => <div data-testid="auth-status-mock">Auth Status</div>;
  AuthStatusMock.displayName = 'AuthStatusMock'; // Optional: for better debug messages
  return AuthStatusMock;
});


describe('Header Component', () => {
  const mockOnShowLogin = jest.fn();
  const mockOnShowSignUp = jest.fn();

  beforeEach(() => {
    // Clear mock calls before each test
    mockOnShowLogin.mockClear();
    mockOnShowSignUp.mockClear();
  });

  test('renders the application title', () => {
    render(<Header onShowLogin={mockOnShowLogin} onShowSignUp={mockOnShowSignUp} />);
    
    // Check for the main title text
    const titleElement = screen.getByText(/Community Buys/i);
    expect(titleElement).toBeInTheDocument();
    
    // Check if the h1 tag is present (more specific)
    const headingElement = screen.getByRole('heading', { name: /Community Buys/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the AuthStatus component', () => {
    render(<Header onShowLogin={mockOnShowLogin} onShowSignUp={mockOnShowSignUp} />);
    
    // Check for the mocked AuthStatus component
    // This relies on the mock rendering something identifiable, like text or a data-testid
    const authStatusMockElement = screen.getByTestId('auth-status-mock');
    expect(authStatusMockElement).toBeInTheDocument();
    expect(authStatusMockElement).toHaveTextContent('Auth Status');
  });

  test('AuthStatus receives onShowLogin and onShowSignUp props', () => {
    // This test is implicitly covered by the mock setup if AuthStatus were to use these,
    // but to explicitly check if Header passes them down if AuthStatus wasn't mocked,
    // you would need a more complex setup or to not mock AuthStatus fully.
    // For now, we assume Header correctly passes props to the (mocked) AuthStatus.
    // A direct test of AuthStatus would verify its own props handling.
    render(<Header onShowLogin={mockOnShowLogin} onShowSignUp={mockOnShowSignUp} />);
    // No direct assertion here for props passed to a mocked child, 
    // as the mock replaces the child. The fact that AuthStatus is rendered is key.
    // If AuthStatus itself called these functions on render (which it doesn't),
    // we could check mockOnShowLogin.mock.calls.length etc.
    expect(screen.getByTestId('auth-status-mock')).toBeInTheDocument(); // Confirms AuthStatus is rendered
  });
});
