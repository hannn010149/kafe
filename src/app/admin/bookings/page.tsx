import React from "react";
import BookingsManagerClient from "@/components/admin/BookingsManagerClient";
import { getBookings, getCafeSettings } from "@/lib/db";

export default async function AdminBookingsPage() {
  const [bookings, settings] = await Promise.all([
    getBookings(),
    getCafeSettings(),
  ]);
  return <BookingsManagerClient initialBookings={bookings} settings={settings} />;
}
