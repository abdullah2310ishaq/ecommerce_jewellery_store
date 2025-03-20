"use client"

import { useState, useEffect } from "react"
import BestSellers from "../comps/homepage/BestSellers"
import Collections from "../comps/homepage/Collections"
import Hero from "../comps/homepage/Hero"
import PromoBanner from "../comps/homepage/PromoBanner"

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)

  // Optional: Hide banner after scrolling past a certain point
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowBanner(false)
      } else {
        setShowBanner(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      <Hero />
      <Collections />
      <BestSellers />
      {showBanner && <PromoBanner />}
    </div>
  )
}

