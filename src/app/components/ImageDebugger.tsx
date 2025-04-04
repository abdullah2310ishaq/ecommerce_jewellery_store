"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ImageDebuggerProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ImageDebugger({ src, alt, width = 300, height = 300, className = "" }: ImageDebuggerProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset states when src changes
    setImageSrc(src)
    setError(null)
    setIsLoading(true)
  }, [src])

  // Function to check if the URL is a Cloudinary URL
  const isCloudinaryUrl = (url: string): boolean => {
    return url.includes("cloudinary.com")
  }

  // Function to check if the URL is a valid URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false
    }
  }

  // Function to get a diagnostic message
  const getDiagnosticMessage = (): string => {
    if (!imageSrc) return "No image source provided"
    if (!isValidUrl(imageSrc)) return "Invalid URL format"
    if (isCloudinaryUrl(imageSrc)) {
      return "Cloudinary URL detected. Format appears correct."
    }
    return "Not a Cloudinary URL. This might be a Firebase URL or another source."
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FB6F90]"></div>
        </div>
      )}

      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Image failed to load:", imageSrc, e)
          setError("Failed to load image")
          setIsLoading(false)
          // Fall back to placeholder
          setImageSrc("/placeholder.svg")
        }}
      />

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <p>
            <strong>URL:</strong> {src}
          </p>
          <p>
            <strong>Diagnostic:</strong> {getDiagnosticMessage()}
          </p>
        </div>
      )}
    </div>
  )
}

