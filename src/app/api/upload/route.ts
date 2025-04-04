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
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "products" // Default folder

    if (!file) {
      console.error("No file provided in upload request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(
      `Processing upload request for file: ${file.name}, size: ${file.size}, type: ${file.type}, folder: ${folder}`,
    )

    // Check if Cloudinary environment variables are set
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary environment variables")
      return NextResponse.json(
        { error: "Server configuration error - missing Cloudinary credentials" },
        { status: 500 },
      )
    }

    console.log(
      `Cloudinary config: cloud_name: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}, API key exists: ${!!process.env.CLOUDINARY_API_KEY}, API secret exists: ${!!process.env.CLOUDINARY_API_SECRET}`,
    )

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64
    const base64String = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64String}`

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: folder,
          resource_type: "auto", // Automatically detect if it's an image or video
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            console.log("Cloudinary upload success:", { publicId: result?.public_id, url: result?.secure_url })
            resolve(result)
          }
        },
      )
    })

    // Return the Cloudinary URL and other details
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return NextResponse.json({ error: "Failed to upload file", }, { status: 500 })
  }
}

