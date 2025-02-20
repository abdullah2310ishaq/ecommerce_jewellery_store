import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition">
      {/* Product Image */}
      <Image 
        src={product.img} 
        alt={product.name} 
        width={400} 
        height={400} 
        className="w-full h-64 object-cover"
      />

      {/* Product Details */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-lg text-[#d4af37] font-semibold">{product.price}</p>
        <Link href={`/product/${product.id}`}>
          <button className="mt-4 px-4 py-2 bg-[#d4af37] text-black rounded-md hover:bg-[#c09c2e] transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
