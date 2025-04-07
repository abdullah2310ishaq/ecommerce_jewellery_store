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
  
  