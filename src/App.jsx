import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import PrintableInvoice from './components/PrintableInvoice';
import { useCart } from './context/CartContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import HotWaterBagPage from './pages/HotWaterBagPage';
import DeliveryPage from './pages/DeliveryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { recentOrder, isInvoiceOpen, setIsInvoiceOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-lavender font-sans text-slate-800">
      <ScrollToTop />
      
      {/* Top Announcement Strip */}
      <AnnouncementBar />

      {/* Sticky Header */}
      <Header />

      {/* Main Content Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/hot-water-bag" element={<HotWaterBagPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <AuthModal />

      {/* Printable Invoice Modal (Triggered on order completion or reopened from account/admin) */}
      {recentOrder && (
        <PrintableInvoice
          order={recentOrder}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
}
