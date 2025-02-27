// cart/cart.ts

import Swal from "sweetalert2";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
  }
  

  
  /** Get cart items from localStorage */
  export function getCart(): CartItem[] {
    const storedCart = localStorage.getItem("myCart");
    if (storedCart) {
      return JSON.parse(storedCart);
    }
    return [];
  }
  
  /** Update cart item quantity */

  

  /** Add item to the cart in localStorage */
  export function addToCart(item: CartItem, toastHandler?: (message: string) => void) {
    let existingCart: CartItem[] = [];
    const storedCart = localStorage.getItem("myCart");
    if (storedCart) {
      existingCart = JSON.parse(storedCart);
    }
  
    // Check if item already in cart
    const existingItem = existingCart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      existingCart.push(item);
    }
  
    localStorage.setItem("myCart", JSON.stringify(existingCart));
  
    // ✅ Call the toast function if provided
    Swal.fire({
      title: "Added to Cart!",
      text: `${item.name} x${item.quantity} added to cart!`,
      icon: "success",
      confirmButtonText: "OK",
    });
    
  }
  
  /** Update cart item quantity */
  export function updateCartItem(itemId: string, newQuantity: number, toastHandler?: (message: string) => void) {
    const existingCart = getCart();
  
    const index = existingCart.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      if (newQuantity <= 0) {
        existingCart.splice(index, 1); // Remove item
      } else {
        existingCart[index].quantity = newQuantity;
      }
    }
  
    localStorage.setItem("myCart", JSON.stringify(existingCart));
  
    // ✅ Call the toast function if provided
    Swal.fire({
      title: "Cart Updated!",
      text: "Cart updated successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
    
  }
  
  /** Clear the entire cart */
  export function clearCart(toastHandler?: (message: string) => void) {
    localStorage.removeItem("myCart");
  
    Swal.fire({
      title: "Cart Cleared!",
      text: "Your cart has been cleared.",
      icon: "info",
      confirmButtonText: "OK",
    });
    
  }
  