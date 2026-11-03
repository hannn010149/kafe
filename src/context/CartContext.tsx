"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  taxAmount: number;
  serviceAmount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("komorebi_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore parsing error
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("komorebi_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if item with exact same options already exists
      const existingIdx = prev.findIndex(
        (it) =>
          it.product.id === newItem.product.id &&
          it.selected_size === newItem.selected_size &&
          it.selected_sweetness === newItem.selected_sweetness &&
          it.selected_ice === newItem.selected_ice &&
          it.selected_milk === newItem.selected_milk &&
          it.custom_notes === newItem.custom_notes
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + newItem.quantity;
        const unitPrice = existing.item_total / existing.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          item_total: unitPrice * newQty,
        };
        return updated;
      }

      return [...prev, newItem];
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      const unitPrice = item.item_total / item.quantity;
      updated[index] = {
        ...item,
        quantity,
        item_total: unitPrice * quantity,
      };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cart.reduce((acc, it) => acc + it.item_total, 0);
  const taxAmount = Math.round(subtotal * 0.10); // 10% PB1
  const serviceAmount = Math.round(subtotal * 0.05); // 5% Service charge
  const totalAmount = subtotal + taxAmount + serviceAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        taxAmount,
        serviceAmount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

