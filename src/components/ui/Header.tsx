import React from 'react';
import AuthStatus from '@/components/auth/AuthStatus'; // Import AuthStatus

interface HeaderProps {
  onShowLogin: () => void;
  onShowSignUp: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLogin, onShowSignUp }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Community Buys</h1>
        <AuthStatus onShowLogin={onShowLogin} onShowSignUp={onShowSignUp} />
      </div>
    </header>
  );
};

export default Header;
