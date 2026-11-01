import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('pr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('pr_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pr_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('pr_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('pr_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, variant, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.productId === (product._id || product.id) && i.variantId === (variant._id || variant.id)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, variant.stock || 99);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem = {
          productId: product._id || product.id,
          variantId: variant._id || variant.id,
          title: product.name,
          tier: product.tier,
          variantInfo: `${variant.colorName} • ${variant.packSize}`,
          price: variant.price,
          comparePrice: variant.comparePrice || Math.round(variant.price * 1.15),
          stock: variant.stock || 50,
          sku: variant.sku,
          image: variant.image || (product.images && product.images[0]) || '/images/products/regular-front.jpg',
          quantity: Math.min(quantity, variant.stock || 99),
        };
        return [...prevItems, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (variantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const clamped = Math.min(newQty, item.stock || 99);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (variantId) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code) => {
    const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal: rawSubtotal }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid coupon code');

    setAppliedCoupon({
      code: data.code,
      discount: data.discount,
      description: data.description,
    });
    return data;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
  const netBeforeTax = Math.max(0, subtotal - discount);
  const deliveryCharge = netBeforeTax >= 399 || netBeforeTax === 0 ? 0 : 49;
  const gst = Math.round(netBeforeTax * 0.05); // 5% GST
  const grandTotal = netBeforeTax + deliveryCharge + gst;
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryCharge,
        gst,
        grandTotal,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
