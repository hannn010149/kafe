import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";
import { getCafeSettings, getCategories, getProducts } from "@/lib/db";

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getCafeSettings(),
    getCategories(),
    getProducts({ onlyAvailable: true }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow">
        <HomeClient
          settings={settings}
          categories={categories}
          initialProducts={products}
        />
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}
