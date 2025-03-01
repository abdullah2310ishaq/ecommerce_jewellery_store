"use client";
import { useState } from "react";
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
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageToShow = product.images?.[0] || "/placeholder.svg";

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden border-2 border-[#FB6F90]/30 hover:border-[#FB6F90] transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated Glow Effect */}
      <div className="absolute inset-0 bg-[#FB6F90]/20 filter blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

      {/* Sale Badge */}
      {product.isOnSale && (
        <motion.div
          className="absolute top-3 right-3 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="bg-[#FB6F90] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sale
          </span>
        </motion.div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <Image
          src={imageToShow}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-bold text-[#FB6F90] truncate">
          {product.name}
        </h3>
        <p className="font-semibold text-2xl mt-1 text-[#FB6F90]">
          Rs. {product.price.toFixed(2)}
        </p>

        {/* Action Button */}
        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href={`/product/${product.id}`}>
            <motion.button
              className="w-full px-4 py-2 bg-[#FB6F90] text-white rounded-md font-medium flex items-center justify-center gap-2 group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View Details</span>
              <Eye className="w-5 h-5 relative z-10" />
              <motion.div
                className="absolute inset-0 bg-[#FB6F90]/80"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ type: "tween" }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-[#FB6F90]/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ProductCard;
