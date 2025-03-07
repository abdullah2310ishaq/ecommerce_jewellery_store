"use client"

import BestSellers from "./comps/homepage/BestSellers";
import Collections from "./comps/homepage/Collections";
import Hero from "./comps/homepage/Hero";

export default function Home() {
  return (
    <div>

      <Hero />
      <Collections />
      <BestSellers />

    </div>
  );
}
