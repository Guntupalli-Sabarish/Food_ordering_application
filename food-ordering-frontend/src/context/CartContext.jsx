import { createContext, useMemo, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }

      return [...prev, { ...item, price: parseFloat(item.price), quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
