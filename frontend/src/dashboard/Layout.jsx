import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onMenuToggle={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      
      <main className="md:ml-48 pt-16 p-4 md:p-6 transition-all duration-300">
        <div className="bg-white text-black min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;