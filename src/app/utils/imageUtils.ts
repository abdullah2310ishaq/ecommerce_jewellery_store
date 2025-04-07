
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!CLOUD_NAME) {
  throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment variables")
}


export const getImageUrl = (url: string | undefined): string => {
    if (!url) return "/placeholder.svg?height=400&width=400"
  
    if (url.includes("cloudinary.com")) {
      return url
    }
  
    if (url.startsWith("https://firebasestorage")) {
      const fileName = url.split("/").pop()?.split("?")[0]
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${fileName}`
    }
  
    return url
  }