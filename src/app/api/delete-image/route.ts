import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: unknown, result: unknown) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

