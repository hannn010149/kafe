import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuClient from "@/components/MenuClient";
import { getCafeSettings, getCategories, getProducts } from "@/lib/db";

export default async function MenuPage() {
  const [settings, categories, products] = await Promise.all([
    getCafeSettings(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <MenuClient
          categories={categories}
          initialProducts={products}
        />
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}
