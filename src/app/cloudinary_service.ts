/**
 * Uploads a file to Cloudinary
 * @param file The file to upload
 * @param folder The folder to upload to (default: 'products')
 * @returns The Cloudinary response with URL and public ID
 */
export async function uploadToCloudinary(file: File, folder = "products") {
  try {
    console.log(`Uploading file to Cloudinary folder: ${folder}`, { fileName: file.name, fileSize: file.size })

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
      throw new Error(errorData.message || `Failed to upload to Cloudinary: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Cloudinary upload successful:", { publicId: data.public_id, url: data.secure_url })

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
 * Extracts the public ID from a Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Example URL: https://res.cloudinary.com/de0v106ai/image/upload/v1631234567/products/abcdef.jpg
    const regex = /\/v\d+\/(.+)\.\w+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting public ID:", error)
    return null
  }
}

