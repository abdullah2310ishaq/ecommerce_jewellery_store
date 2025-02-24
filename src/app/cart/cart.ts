// cart/cart.ts

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
  }
  
  /** Add item to the cart in localStorage */
  export function addToCart(item: CartItem) {
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
    alert(`Added ${item.name} x${item.quantity} to cart!`);
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
  export function updateCartItem(itemId: string, newQuantity: number) {
    const existingCart = getCart();
  
    const index = existingCart.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      if (newQuantity <= 0) {
        // remove item
        existingCart.splice(index, 1);
      } else {
        existingCart[index].quantity = newQuantity;
      }
    }
  
    localStorage.setItem("myCart", JSON.stringify(existingCart));
  }
  
  /** Clear the entire cart */
  export function clearCart() {
    localStorage.removeItem("myCart");
  }
  