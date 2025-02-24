"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartItems, removeFromCart, updateCartItem } from "../firebase/firebase_services/firebaseCart";

interface ICartItem {
  id: string; // Ensure ID is always a string
  name: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCartItems(null); // Null for guest users

      // ✅ Ensure 'id' is always a string (fallback to empty string if undefined)
      const processedCart = cartData.map((item) => ({
        id: item.id || "", // Fallback to empty string if undefined
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      setCart(processedCart);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleRemove = async (productId: string) => {
    await removeFromCart(null, productId);
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    await updateCartItem(null, productId, newQuantity);
    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
  };

  if (loading) return <p>Loading cart...</p>;
  if (!cart.length) return <p>Your cart is empty.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b py-4">
            <span>{item.name}</span>
            <span>${item.price}</span>
            <div className="flex items-center">
              <button onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}>-</button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => handleRemove(item.id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
      <button
        className="mt-6 bg-yellow-600 text-white px-6 py-3 rounded"
        onClick={() => router.push("/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
