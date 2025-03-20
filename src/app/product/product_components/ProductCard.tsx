"use client";
"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Eye } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  isOnSale?: boolean;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  product: Product;
  viewMode: "grid" | "list";
}

// Animation variants defined outside to avoid re-creation on every render.
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const badgeVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1 }
};

// Extracted SaleBadge component.
const SaleBadge = () => (
  <motion.div
    className="z-10"
    variants={badgeVariants}
    initial="hidden"
    animate="visible"
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  >
    <span className="bg-[#FB6F90] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
      <Sparkles className="w-3 h-3" />
      Sale
    </span>
  </motion.div>
);

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const imageToShow = product.images?.[0] || "/placeholder.svg";

  if (viewMode === "grid") {
    return (
      <motion.div
        className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-[#FB6F90] hover:shadow-lg transition-all duration-300 group h-full"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        {/* Sale Badge */}
        {product.isOnSale && (
          <div className="absolute top-2 right-2">
            <SaleBadge />
          </div>
        )}

        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={imageToShow}
            src={imageToShow}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Details */}
        <div className="p-3 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-[#FB6F90] transition-colors">
            {product.name}
          </h3>
          <p className="font-medium text-xl text-[#FB6F90]">
            Rs. {product.price.toFixed(2)}
          </p>

          {/* Action Button */}
          <Link href={`/product/${product.id}`}>
            <motion.button
              className="w-full mt-2 px-3 py-1.5 bg-white text-[#FB6F90] border border-[#FB6F90] rounded-md font-medium flex items-center justify-center gap-1.5 group-hover:bg-[#FB6F90] group-hover:text-white transition-colors duration-300"
              whileTap={{ scale: 0.97 }}
            >
              <span>View Details</span>
              <Eye className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
    );
  }

  // List mode card
  return (
    <motion.div
      className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-[#FB6F90] hover:shadow-lg transition-all duration-300 group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Sale Badge */}
        {product.isOnSale && (
          <div className="absolute top-2 left-2">
            <SaleBadge />
          </div>
        )}

        {/* Product Image */}
        <div className="relative overflow-hidden sm:w-1/3">
          <div className="aspect-square sm:aspect-[4/3]">
            <Image
              src={imageToShow}
              src={imageToShow}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Details */}
        <div className="p-4 sm:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#FB6F90] transition-colors">
              {product.name}
            </h3>
            <p className="font-medium text-2xl text-[#FB6F90] mt-2">
              Rs. {product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-2 line-clamp-2">
              {product.description || "Beautiful jewelry piece crafted with precision and care."}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Link href={`/product/${product.id}`}>
              <motion.button
                className="px-4 py-2 bg-white text-[#FB6F90] border border-[#FB6F90] rounded-md font-medium flex items-center justify-center gap-2 group-hover:bg-[#FB6F90] group-hover:text-white transition-colors duration-300 max-w-xs"
                whileTap={{ scale: 0.97 }}
              >
                <span>View Details</span>
                <Eye className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
  );
};

export default memo(ProductCard);
