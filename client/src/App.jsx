import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import CustomerDashboard from './pages/CustomerDashboard';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSalesChannels from './pages/admin/AdminSalesChannels';
import AdminContent from './pages/admin/AdminContent';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Public layout wrapper with Navbar, Footer, and CartDrawer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Protected Customer Route
function CustomerRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Public Storefront Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route
                  path="dashboard"
                  element={
                    <CustomerRoute>
                      <CustomerDashboard />
                    </CustomerRoute>
                  }
                />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="sales-channels" element={<AdminSalesChannels />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
