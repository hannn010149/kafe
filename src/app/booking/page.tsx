import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingClient from "@/components/BookingClient";
import { getCafeSettings, getTables } from "@/lib/db";

export default async function BookingPage() {
  const [settings, tables] = await Promise.all([
    getCafeSettings(),
    getTables(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <BookingClient settings={settings} tables={tables} />
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}
