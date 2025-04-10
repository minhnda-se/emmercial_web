import { Cog, CookingPot } from "lucide-react";
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
      // If item already exists, check if adding would exceed limit
      const currentQuantity = cartItems[existingItemIndex].quantity;
      const newQuantity = currentQuantity + productInfo.quantity;
      // If already at max quantity, return false to indicate failure
      if (newQuantity > 100) {
        return false;
      }

      const updatedCartItems = [...cartItems];

      // Calculate new quantity, but limit to maximum of 100

      // Set the new quantity (capped at 100)
      updatedCartItems[existingItemIndex].quantity = newQuantity;

      // Update the total price based on the new quantity
      updatedCartItems[existingItemIndex].totalPrice =
        updatedCartItems[existingItemIndex].price * newQuantity;

      setCartItems(updatedCartItems);

      // Return true if operation was fully successful (didn't hit cap)
      // Return false if we had to cap the quantity
      return currentQuantity + productInfo.quantity <= 100;
    } else {
      // If item doesn't exist, add it to the cart
      setCartItems([...cartItems, productInfo]);
      return true;
    }
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };
  const deleteCart = (itemsToDelete) => {
    // Create a new updated cart by filtering out the items to be deleted
    const updatedCartItems = cartItems.filter(
      (item) => !itemsToDelete.some((deleteItem) => deleteItem.id === item.id)
    );

    // Update the cart state with the new list
    setCartItems(updatedCartItems);

    // Update localStorage to reflect the changes
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeItem, deleteCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart context
export const useCart = () => useContext(CartContext);
