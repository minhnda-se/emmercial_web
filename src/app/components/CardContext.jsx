import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for the cart
const CartContext = createContext();

// Cart Provider that will be used to wrap the app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage initially
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });

  // Sync the cart state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productInfo) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === productInfo.id
    );

    if (existingItemIndex !== -1) {
      // If item already exists, update the quantity
      const updatedCartItems = [...cartItems];

      // Calculate new quantity, but limit to maximum of 100
      const newQuantity = Math.min(
        updatedCartItems[existingItemIndex].quantity + productInfo.quantity,
        100
      );

      // Set the new quantity (capped at 100)
      updatedCartItems[existingItemIndex].quantity = newQuantity;

      // Update the total price based on the new quantity
      updatedCartItems[existingItemIndex].totalPrice =
        updatedCartItems[existingItemIndex].price * newQuantity;
      setCartItems(updatedCartItems);
    } else {
      // If item doesn't exist, add it to the cart
      setCartItems([...cartItems, productInfo]);
    }
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart context
export const useCart = () => useContext(CartContext);
