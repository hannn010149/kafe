import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackClient from "@/components/TrackClient";
import { getCafeSettings } from "@/lib/db";

export default async function TrackPage() {
  const settings = await getCafeSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar cafeSettings={settings} />
      <main className="grow pt-28 pb-20">
        <TrackClient settings={settings} />
      </main>
      <Footer cafeSettings={settings} />
    </div>
  );
}

