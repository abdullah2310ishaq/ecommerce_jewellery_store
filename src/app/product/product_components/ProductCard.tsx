import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
  // rating?: number; // Optional if you want dynamic ratings
  // isOnSale?: boolean; // Optional if you want to conditionally render a badge
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      {/* Optional Sale or New Badge */}
      {/* You can conditionally render this badge if product.isOnSale is true, etc. */}
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
        Sale
      </span>

      {/* Product Image */}
      <div className="overflow-hidden">
        <Image
          src={product.img}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
          {product.name}
        </h3>
        <p className="text-[#d4af37] font-semibold text-md md:text-lg mt-1">
          {product.price}
        </p>

        {/* Optional Star Rating (hard-coded for demo; replace with dynamic data if available) */}
        <div className="flex justify-center items-center mt-2 mb-4 space-x-1">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.545l6.561-.955L10 0l3.439 5.59L20 6.545l-5.245 4.999 1.123 6.546z" />
            </svg>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          <Link href={`/product/${product.id}`}>
            <button className="px-4 py-2 bg-[#d4af37] text-black rounded-md hover:bg-[#c09c2e] transition-colors">
              View Details
            </button>
          </Link>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
