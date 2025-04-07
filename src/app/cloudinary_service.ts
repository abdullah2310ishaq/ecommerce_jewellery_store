import type { ImageLoaderProps } from "next/image"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!CLOUD_NAME) {
  throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment variables")
}

/**
 * Uploads a file to Cloudinary
 * @param file The file to upload
 * @param folder The folder to upload to (default: 'products')
 * @returns The Cloudinary response with URL and public ID
 */
export async function uploadToCloudinary(file: File, folder = "products") {
  try {
    console.log(`Uploading file to Cloudinary folder: ${folder}`, {
      fileName: file.name,
      fileSize: file.size,
    })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cloudinary upload failed:", errorData)
      throw new Error(
        errorData.message ||
          `Failed to upload to Cloudinary: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log("Cloudinary upload successful:", {
      publicId: data.public_id,
      url: data.secure_url,
    })

    return {
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error)
    throw error
  }
}

/**
 * Deletes a file from Cloudinary
 * @param publicId The public ID of the file to delete
 * @returns The Cloudinary response
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const response = await fetch("/api/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete from Cloudinary")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in deleteFromCloudinary:", error)
    throw error
  }
}

/**
 * Extracts the public ID from a Cloudinary URL using regex
 */
export function getPublicIdFromUrlRegex(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting public ID with regex:", error)
    return null
  }
}

/**
 * Extracts the public ID from a Cloudinary URL using URL parsing
 */
export function getPublicIdFromUrl(url: string): string {
  if (!url) return ""

  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const uploadIndex = pathParts.findIndex((part) => part === "upload")

    if (uploadIndex !== -1 && uploadIndex + 2 < pathParts.length) {
      return pathParts.slice(uploadIndex + 2).join("/")
    }

    return url
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error)
    return url
  }
}

/**
 * Builds a Cloudinary URL from a public ID and optional transformations
 */
export function getCloudinaryUrl(publicId: string, transformations = ""): string {
  if (!publicId) return ""
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}

/**
 * Cloudinary loader for Next.js <Image /> component
 */
export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  if (src.startsWith("http")) {
    return src
  }

  const params = [`w_${width}`, `q_${quality || "auto"}`]
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(",")}/v1/${src}`
}

/**
 * Utility to convert Firebase Storage URLs to Cloudinary URLs or fallback
 */
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
