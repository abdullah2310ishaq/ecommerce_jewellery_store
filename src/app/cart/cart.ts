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
  return storedCart ? JSON.parse(storedCart) : [];
}

/** Add item to the cart in localStorage */
export function addToCart(item: CartItem) {
  let existingCart: CartItem[] = [];
  const storedCart = localStorage.getItem("myCart");
  if (storedCart) {
    existingCart = JSON.parse(storedCart);
  }

  // Check if item is already in cart
  const existingItem = existingCart.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    existingCart.push(item);
  }

  localStorage.setItem("myCart", JSON.stringify(existingCart));

  // Show success alert
  Swal.fire({
    title: "Added to Cart!",
    text: `${item.name} x${item.quantity} added to cart!`,
    icon: "success",
    confirmButtonText: "OK",
  });
}

/** Update cart item quantity */
export function updateCartItem(itemId: string, newQuantity: number) {
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

  // Show success alert
  Swal.fire({
    title: "Cart Updated!",
    text: "Cart updated successfully!",
    icon: "success",
    confirmButtonText: "OK",
  });
}

/** Clear the entire cart */
export function clearCart() {
  localStorage.removeItem("myCart");

  // Show info alert
  Swal.fire({
    title: "Order Placed",
    text: "Your order has been placed. You ll be informed shortly",
    icon: "info",
    confirmButtonText: "OK",
  });
}
