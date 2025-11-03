import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { useEffect, useState } from 'react';
import Navbar from './pages/Navbar';
import HomePage from './pages/Home';
import BrandsPage from './components/BrandsPage';
import OurVisionPage from './components/OurVision';
import AboutUsPage from './components/Aboutus';
import WhyChooseUsPage from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Footer from './pages/Footer';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import TermsOfService from './components/TermsOfService';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Nike from './pages/Nike';
import Adidas from './pages/Adidas';
import NewBalance from './pages/NewBalance';
import Puma from './pages/Puma'; 
import Hoka from './pages/Hoka';
import Fila from './pages/Fila';
import UnderArmour from './pages/UnderArmour';
import Skechers from './pages/Skechers';
import Mens from './pages/Mens';
import Womens from './pages/Womens';
import Jackets from './pages/Jackets';
import Shirts from './pages/Shirts';
import Pants from './pages/Pants';
import Kids from './pages/Kids';
import Shoes from './pages/Shoes';
import Off from './pages/Off';
import Dashboard from './dashboard/Dashboard';
import AdminLogin from './dashboard/AdminLogin';
import SearchResults from './pages/SearchResults';

// Create a simple global state management
let isDetailPageOpen = false;
let setDetailPageOpenCallback = null;

export const setDetailPageOpen = (value) => {
  isDetailPageOpen = value;
  if (setDetailPageOpenCallback) {
    setDetailPageOpenCallback(value);
  }
};

export const registerDetailPageCallback = (callback) => {
  setDetailPageOpenCallback = callback;
};

// Horizontal scroll fix component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    
    console.log('Route changed - Scrolled to top');
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [detailPageState, setDetailPageState] = useState(false);
  
  // Register the callback for detail page state updates
  useEffect(() => {
    registerDetailPageCallback(setDetailPageState);
  }, []);

  // Check if current route is login, cart, OR any dashboard route, OR detail page is open
  const hideNavbarFooter = 
    location.pathname === '/AuthAdmin' || 
    location.pathname === '/cart' ||
    location.pathname.startsWith('/AuthDashboard') ||
    detailPageState;

  return (
    <SearchProvider>
    <CartProvider>
      <ScrollToTop />
      
      {/* Conditionally render Navbar */}
      {!hideNavbarFooter && <Navbar />}
      
      <Routes>
        <Route path="/" element={
          <>
            <HomePage />
            <BrandsPage />
            <OurVisionPage />
            <Testimonials/>
            <WhyChooseUsPage/>
          </>
        } />
        <Route path="/AuthAdmin" element={<AdminLogin />} />
        <Route path="/AuthDashboard/*" element={<Dashboard />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favourites" element={<Wishlist />} />
        <Route path="/nike" element={<Nike />} />
        <Route path="/adidas" element={<Adidas />} />
        <Route path="/newbalance" element={<NewBalance />} />
        <Route path="/puma" element={<Puma />} />
        <Route path="/hoka" element={<Hoka />} />
        <Route path="/skechers" element={<Skechers />} />
        <Route path="/fila" element={<Fila />} />
        <Route path="/under-armour" element={<UnderArmour />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/jackets" element={<Jackets />} />
        <Route path="/shirts" element={<Shirts />} />
        <Route path="/pants" element={<Pants />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/shoes" element={<Shoes />} />
        <Route path="/sale" element={<Off />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      
      {/* Conditionally render Footer */}
      {!hideNavbarFooter && <Footer />}
    </CartProvider>
    </SearchProvider>
  );
}

export default App;