import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'periodready_cart_v1';
const ADDRESS_STORAGE_KEY = 'periodready_last_address_v1';

export function CartProvider({ children }) {
  const { user, setAuthModalOpen, setPendingAddToCart } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [address, setAddress] = useState(() => {
    return localStorage.getItem(ADDRESS_STORAGE_KEY) || '';
  });
  const [recentOrder, setRecentOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Cart sync error', e);
    }
  }, [items]);

  // Sync address to localStorage
  useEffect(() => {
    if (address) {
      localStorage.setItem(ADDRESS_STORAGE_KEY, address);
    }
  }, [address]);

  // Add to cart with mandatory account check
  const addToCart = (product, options = {}) => {
    // If user is not signed up/logged in, prompt account creation and queue the item!
    if (!user) {
      setPendingAddToCart({ product, options });
      setAuthModalOpen(true);
      return false;
    }

    const { color, quantity = 1 } = options;
    const itemKey = color ? `${product.id}-${color}` : product.id;
    const displayName = color ? `${product.name} (${color})` : product.name;

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.key === itemKey);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            key: itemKey,
            id: product.id,
            name: displayName,
            shortName: product.shortName,
            price: product.price,
            image: options.image || product.images[0].url,
            color: color || null,
            quantity: quantity
          }
        ];
      }
    });

    setIsDrawerOpen(true);
    return true;
  };

  // Direct execute queued add to cart (used right after signup)
  const executePendingAdd = (pending) => {
    if (!pending?.product) return;
    const { product, options = {} } = pending;
    const { color, quantity = 1 } = options;
    const itemKey = color ? `${product.id}-${color}` : product.id;
    const displayName = color ? `${product.name} (${color})` : product.name;

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.key === itemKey);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            key: itemKey,
            id: product.id,
            name: displayName,
            shortName: product.shortName,
            price: product.price,
            image: options.image || product.images[0].url,
            color: color || null,
            quantity: quantity
          }
        ];
      }
    });
    setPendingAddToCart(null);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (key, delta) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (key) => {
    setItems(prev => prev.filter(item => item.key !== key));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Emergency 10-min free delivery promo
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      address,
      setAddress,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      executePendingAdd,
      updateQuantity,
      removeFromCart,
      clearCart,
      recentOrder,
      setRecentOrder,
      isInvoiceOpen,
      setIsInvoiceOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
