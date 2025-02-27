"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("access_key", "0ae49b2c-63bb-4bb0-829a-47ceaa0c9fcb");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult("An error occurred while submitting the form.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-amber-50">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div className="relative h-full w-full">
          <Image 
            src="/jewelry-banner.jpg" 
            alt="Luxury jewelry display"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 drop-shadow-lg">
              H&H Jewelers
            </h1>
            <p className="text-xl md:text-2xl text-amber-50 max-w-3xl mx-auto font-light tracking-wide">
              <span className="border-b-2 border-amber-400 pb-1">Crafting Timeless Elegance Since 1995</span>
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-950 to-transparent z-10"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Our Heritage Section with Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-lg blur-md opacity-25"></div>
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image 
                  src="/logo.jpg?height=500&width=500" 
                  alt="H&H Jewelers craftsmanship" 
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl font-semibold text-amber-300 relative after:content-[''] after:absolute after:w-1/2 after:h-[3px] after:bg-gradient-to-r after:from-amber-400 after:to-transparent after:bottom-0 after:left-0 pb-2">
                Our Heritage
              </h2>
            </div>
            <p className="text-lg leading-relaxed">
              Welcome to H&H Jewelers, where artistry meets elegance. Our journey began with a passion for timeless design, aiming to create jewelry that transcends generations and captures lifes most precious moments.
            </p>
            <p className="text-lg leading-relaxed">
              Each H&H creation embodies the perfect harmony of tradition and innovation. Our master artisans blend age-old techniques with contemporary vision, crafting pieces that are not merely accessories, but expressions of individuality and milestones of personal significance.
            </p>
            <div className="flex items-center space-x-4 text-amber-400 mt-6">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-light">Established 1995</span>
            </div>
          </div>
        </div>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center my-20">
          <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"></div>
          <div className="mx-4">
            <div className="w-3 h-3 rotate-45 bg-amber-400"></div>
          </div>
          <div className="w-1/3 h-px bg-gradient-to-l from-transparent via-amber-700/50 to-transparent"></div>
        </div>

        {/* Values Section with Hover Effects */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-amber-300 inline-block relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-amber-400 after:to-transparent after:bottom-0 after:left-0 pb-3">
              Our Values
            </h2>
            <p className="text-lg text-amber-50/80 max-w-3xl mx-auto mt-6">
              The principles that guide us in creating pieces worthy of your most cherished moments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Exquisite Craftsmanship",
                description: "Our artisans bring decades of expertise to each piece, meticulously creating jewelry that stands as a testament to human skill and artistic vision."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Uncompromising Quality",
                description: "We source only the finest ethically-obtained materials, ensuring every gemstone and precious metal meets our exacting standards for beauty and longevity."
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Personalized Service",
                description: "Your journey with us extends beyond the purchase. We provide attentive, personalized service to help you find or create the perfect piece that tells your unique story."
              }
            ].map((value, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-600/5 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative bg-gray-900/40 backdrop-blur-sm p-8 rounded-xl border border-amber-900/30 shadow-lg transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  <div className="text-amber-400 mb-4 group-hover:scale-110 transform transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-amber-300">
                    {value.title}
                  </h3>
                  <p className="text-amber-50/80 group-hover:text-amber-50 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

    
    
      </div>

  {/* Contact Section with Proper Layout Fix */}
<section id="contact" className="py-20 px-4 relative">
  <div className="absolute inset-0 bg-black/80"></div>
  <div className="absolute inset-0 opacity-20">
  
  </div>
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 mb-6">
        Connect With Us
      </h2>
      <p className="text-amber-50/80 max-w-2xl mx-auto text-lg">
        We are here to assist you on your journey to find the perfect piece of jewelry
      </p>
    </div>

    {/* Contact Info + Form + Image Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      
      {/* Contact Info */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex flex-col space-y-6 bg-gray-900/80 backdrop-blur-md p-8 rounded-xl border border-amber-700/30 shadow-xl">
          <h3 className="text-2xl font-semibold text-amber-300 mb-4">Visit Our Boutique</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <MapPin className="text-amber-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-amber-100 font-medium">Our Location</p>
              <p className="text-amber-100/70">Luxury Mall, Islamabad</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Phone className="text-amber-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-amber-100 font-medium">Call Us</p>
              <a href="tel:+92-346-2207429" className="text-amber-100/70 hover:text-amber-300 transition-colors duration-300">
                +92-344-5751822
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Mail className="text-amber-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-amber-100 font-medium">Email Us</p>
              <a href="mailto:contact@hjewelers.com" className="text-amber-100/70 hover:text-amber-300 transition-colors duration-300">
              handhjewelry925@gmail.com
              </a>
            </div>
          </div>
          <div className="pt-4 border-t border-amber-700/30 mt-4">
            <p className="text-amber-100/70">
              Experience our exquisite collection in person at our elegant showroom.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-md p-8 rounded-xl border border-amber-700/30 shadow-xl">
          <form onSubmit={onSubmit} className="space-y-5">
            <h3 className="text-2xl font-semibold text-amber-300 mb-4">Send a Message</h3>
            <div>
              <label htmlFor="name" className="text-amber-200 text-sm font-medium block mb-2">Your Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-3 rounded-md bg-gray-800/90 border border-amber-700/30 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-amber-200 text-sm font-medium block mb-2">Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-md bg-gray-800/90 border border-amber-700/30 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="text-amber-200 text-sm font-medium block mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                className="w-full p-3 rounded-md bg-gray-800/90 border border-amber-700/30 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 min-h-[120px]"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-medium py-3 px-6 rounded-md shadow-lg transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-1"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {result && (
              <p className={`text-sm ${result.includes("Successfully") ? "text-green-400" : "text-red-400"}`}>
                {result}
              </p>
            )}
          </form>
        </div>
      </div>



    </div>
  </div>
</section>


    </div>
  );
}