import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'HomePageMgt', path: '/AuthDashboard/homepagemgt' },
    { name: 'CartMgt', path: '/AuthDashboard/cartmgt' },
    { name: 'NikeMgt', path: '/AuthDashboard/nikemgt' },
    { name: 'AdidasMgt', path: '/AuthDashboard/adidasmgt' },
    { name: 'PumaMgt', path: '/AuthDashboard/pumamgt' },
    { name: 'NewBalanceMgt', path: '/AuthDashboard/newbalancemgt' },
    { name: 'SkechersMgt', path: '/AuthDashboard/skechersmgt' },
    { name: 'UnderArmourMgt', path: '/AuthDashboard/underarmourmgt' },
    { name: 'HokaMgt', path: '/AuthDashboard/hokamgt' },
    { name: 'FilaMgt', path: '/AuthDashboard/filamgt' },
    { name: 'JacketsMgt', path: '/AuthDashboard/jacketsmgt' },
    { name: 'ShirtsMgt', path: '/AuthDashboard/shirtsmgt' },
    { name: 'PantsMgt', path: '/AuthDashboard/pantsmgt' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-gray-200 w-48 fixed top-16 left-0 
          overflow-y-auto transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          pb-6  // Bottom padding for breathing room
          flex flex-col justify-between
        `}
        style={{ height: 'calc(100vh - 4rem)' }} // 4rem = top-16
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-black text-lg font-bold text-center">
            WalkWyze
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={`block w-full text-left text-sm py-2 px-3 rounded transition-colors ${
                    isActive(item.path)
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Spacer (Optional Visual Balance) */}
        <div className="p-10 text-xs text-gray-500 text-center">
          
        </div>
      </aside>
    </>
  );
};

export default Sidebar;