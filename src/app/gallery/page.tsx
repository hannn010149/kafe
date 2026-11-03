import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCafeSettings } from "@/lib/db";

export default async function GalleryPage() {
  const settings = await getCafeSettings();

  const galleryItems = [
    {
      url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
      title: "Sudut Tenang Tatami",
      category: "Ambiance",
    },
    {
      url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80",
      title: "Uji Ceremonial Matcha Latte",
      category: "Signature Drink",
    },
    {
      url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=80",
      title: "Tokyo Fluffy Souffle Pancake",
      category: "Dessert",
    },
    {
      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
      title: "Manual Pour-Over Barista Corner",
      category: "Coffee",
    },
    {
      url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80",
      title: "Main Dining Hall & Komorebi Light",
      category: "Interior",
    },
    {
      url: "https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=1000&q=80",
      title: "Fresh Strawberry Cream Sando",
      category: "Food",
    },
    {
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
      title: "Traditional Chasen & Ceramic Bowl",
      category: "Artisan",
    },
    {
      url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=80",
      title: "12-Hour Kyoto Cold Drip Tonic",
      category: "Cold Brew",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#536B54] bg-[#E2ECE2] px-3.5 py-1 rounded-full">
              Ruang & Sajian
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#232724]">
              Galeri Komorebi
            </h1>
            <p className="text-xs sm:text-sm text-[#7E8680]">
              Sentuhan estetika minimalis, kehangatan kayu alami, dan karya sajian kuliner Jepang.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-[#F3ECE0] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5D8C6] font-mono">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}
