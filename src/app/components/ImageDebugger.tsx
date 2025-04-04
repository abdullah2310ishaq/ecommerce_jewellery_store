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

interface UrlInfo {
  protocol?: string
  hostname?: string
  pathname?: string
  isCloudinary?: boolean
  isFirebase?: boolean
  error?: string
}

export default function ImageDebugger({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
}: ImageDebuggerProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [urlDetails, setUrlDetails] = useState<UrlInfo | null>(null)
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setError(null)
    setIsLoading(true)
    setImageSrc(src)

    try {
      const url = new URL(src)
      setUrlDetails({
        protocol: url.protocol,
        hostname: url.hostname,
        pathname: url.pathname,
        isCloudinary: url.hostname.includes("cloudinary.com"),
        isFirebase: url.hostname.includes("firebasestorage.googleapis.com"),
      })
    } catch {
      setUrlDetails({ error: "Invalid URL format" })
    }
  }, [src])

  const getDiagnosticMessage = (): string => {
    if (!src) return "No image source provided"
    if (urlDetails?.error) return "Invalid URL format"
    if (urlDetails?.isCloudinary) return "Cloudinary URL detected. Format appears correct."
    if (urlDetails?.isFirebase) return "Firebase Storage URL detected."
    return "Unrecognized image URL source."
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FB6F90]" />
        </div>
      )}

      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Image failed to load:", imageSrc, e)
          setError("Failed to load image")
          setImageSrc("/placeholder.svg")
          setIsLoading(false)
        }}
      />

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <p><strong>Error:</strong> {error}</p>
          <p><strong>URL:</strong> {src}</p>
          <p><strong>Diagnostic:</strong> {getDiagnosticMessage()}</p>
        </div>
      )}
    </div>
  )
}
