import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminToken');
    
    // Redirect to admin login
    navigate('/AuthAdmin');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
      {/* Mobile Menu Button - Only on mobile */}
      <button 
        onClick={onMenuToggle}
        className="md:hidden text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Empty div for spacing on desktop - matches menu button width */}
      <div className="hidden md:block w-10"></div>
      
      {/* Center Title - Always centered */}
      <h1 className="text-black text-xl font-semibold text-center absolute left-1/2 transform -translate-x-1/2 md:static md:left-auto md:transform-none">
        WalkWyze
      </h1>
      
      {/* Logout Button */}
      <div className="flex items-center">
        <button 
          onClick={handleLogout}
          className="bg-black text-white px-3 py-2 md:px-4 md:py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;