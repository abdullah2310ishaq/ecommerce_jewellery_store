
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!CLOUD_NAME) {
  throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment variables")
}

/**
 * Utility function to get the proper image URL from Cloudinary or other sources
 * @param imageUrl The raw image URL or path
 * @returns Properly formatted image URL
 */
export const getImageUrl = (url: string | undefined): string => {
    if (!url) return "/placeholder.svg?height=400&width=400"
  
    // If it's already a Cloudinary URL, return it as is
    if (url.includes("cloudinary.com")) {
      return url
    }
  
    // For Firebase Storage URLs, extract the filename and convert to Cloudinary URL
    if (url.startsWith("https://firebasestorage")) {
      const fileName = url.split("/").pop()?.split("?")[0]
      if (!fileName) return "/placeholder.svg?height=400&width=400"
  
      const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${fileName}`
    }
  
    // For public IDs without full URL
    if (!url.startsWith("http") && !url.startsWith("/")) {
      const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${url}`
    }
  
    // For local images in the public folder
    return url
  }
  
  /**
   * Format price as currency
   * @param price The price to format
   * @returns Formatted price string
   */
  export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }
  
  