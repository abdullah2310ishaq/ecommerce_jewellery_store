// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const CheckoutPage = () => {
//   const router = useRouter();
//   const [cart, setCart] = useState<any[]>([]);
//   const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" });

//   useEffect(() => {
//     const fetchCart = async () => {
//       const cartData = await getCartItems(null); // Null for guests
//       setCart(cartData);
//     };
//     fetchCart();
//   }, []);

//   const handleOrder = async () => {
//     if (!form.name || !form.phone || !form.address) {
//       alert("Please enter your name, phone, and address.");
//       return;
//     }
//     if (!cart.length) {
//       alert("Your cart is empty.");
//       return;
//     }

//     // Save order to Firestore
//     await createOrder("guest", cart, form);
//     await clearCart(null);

//     alert("Order placed successfully!");
//     router.push("/order-confirmation");
//   };

//   if (!cart.length) return <p>Your cart is empty.</p>;

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Checkout</h1>

//       <div className="mb-4">
//         <label>Name:</label>
//         <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="w-full p-2 border rounded"/>
//       </div>

//       <div className="mb-4">
//         <label>Phone Number:</label>
//         <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
//           className="w-full p-2 border rounded"/>
//       </div>

//       <div className="mb-4">
//         <label>Shipping Address:</label>
//         <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
//           className="w-full p-2 border rounded"></textarea>
//       </div>

//       <div className="mb-4">
//         <label>Email (Optional):</label>
//         <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="w-full p-2 border rounded"/>
//       </div>

//       <button
//         className="bg-yellow-600 text-white px-6 py-3 rounded"
//         onClick={handleOrder}
//       >
//         Place Order
//       </button>
//     </div>
//   );
// };

// export default CheckoutPage;
