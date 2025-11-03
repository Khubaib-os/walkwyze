import React from 'react';
import Layout from './Layout';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import NikeMgt from './NikeMgt';
import AdidasMgt from './AdidasMgt';
import PumaMgt from './PumaMgt';
import NewBalanceMgt from './NewBalanceMgt';
import SkechersMgt from './SkechersMgt';
import UnderArmourMgt from './UnderArmourMgt';
import HokaMgt from './HokaMgt';
import FilaMgt from './FilaMgt';
import JacketsMgt from './JacketsMgt';
import ShirtsMgt from './ShirtsMgt';
import PantsMgt from './PantsMgt';
import CartMgt from './CartMgt';
import HomePageMgt from './HomePageMgt';

// Placeholder components for each page
const MensPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Mens Products</h2><p>Mens page content will go here...</p></div>;
const WomensPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Womens Products</h2><p>Womens page content will go here...</p></div>;
const KidsPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Kids Products</h2><p>Kids page content will go here...</p></div>;
const ShoesPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Shoes</h2><p>Shoes page content will go here...</p></div>;
const JacketsPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Jackets</h2><p>Jackets page content will go here...</p></div>;
const ShirtsPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Shirts</h2><p>Shirts page content will go here...</p></div>;
const PantsPage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Pants</h2><p>Pants page content will go here...</p></div>;
const SalePage = () => <div className="p-4"><h2 className="text-lg font-semibold mb-4">Sale</h2><p>Sale page content will go here...</p></div>;

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/" element={
            <div className="px-4 py-8 md:px-8 md:py-12 text-center">
              <h2 className="text-black text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
                Welcome to WalkWyze Dashboard
              </h2>
            </div>
          } />
          
          <Route path="/cartmgt" element={<CartMgt />} />
          <Route path="/homepagemgt" element={<HomePageMgt />} />
          <Route path="/nikemgt" element={<NikeMgt />} />
          <Route path="/adidasmgt" element={<AdidasMgt />} />
          <Route path="/pumamgt" element={<PumaMgt />} />
          <Route path="/newbalancemgt" element={<NewBalanceMgt />} />
          <Route path="/skechersmgt" element={<SkechersMgt />} />
          <Route path="/underarmourmgt" element={<UnderArmourMgt />} />
          <Route path="/hokamgt" element={<HokaMgt />} />
          <Route path="/filamgt" element={<FilaMgt />} />
          <Route path="/jacketsmgt" element={<JacketsMgt />} />
          <Route path="/shirtsmgt" element={<ShirtsMgt />} />
          <Route path="/pantsmgt" element={<PantsMgt />} />
        
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;