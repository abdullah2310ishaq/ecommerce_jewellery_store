"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "./ProductList";

const ProductCard = ({ product }: { product: Product }) => {
  // If rating is missing, default to 5 (?)
  const displayRating = product.rating || 5;

  // Show the first image in the array, or fallback
  const imageToShow = product.images?.[0] || "/placeholder.svg";

  return (
    <div className="group relative bg-black rounded-lg shadow-md overflow-hidden border border-transparent hover:border-yellow-600 transition-transform transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-600/20 p-2">
      {/* Sale Badge */}
      {product.isOnSale && (
        <span className="absolute top-3 right-3 bg-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
          Sale
        </span>
      )}

      {/* Product Image */}
      <div className="overflow-hidden rounded-md bg-black">
        <Image
          src={imageToShow}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 text-center space-y-4 bg-gradient-to-b from-black to-gray-900 rounded-md">
        <h3 className="text-lg md:text-xl font-semibold text-yellow-400">
          {product.name}
        </h3>
        <p className="font-semibold text-md md:text-lg mt-1 text-yellow-300">
          ${product.price}
        </p>

        {/* Rating */}
        <div className="flex justify-center items-center mt-2 mb-4 space-x-1">
          {[...Array(displayRating)].map((_, index) => (
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
            <button className="px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium">
              View Details
            </button>
          </Link>
          <button className="px-4 py-2 bg-gray-700 text-yellow-200 rounded-md hover:bg-gray-600 hover:text-yellow-100 transition-colors font-medium">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
