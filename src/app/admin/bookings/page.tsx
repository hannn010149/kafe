import React from "react";
import BookingsManagerClient from "@/components/admin/BookingsManagerClient";
import { getBookings, getCafeSettings } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminBookingsPage() {
  await requireAdminSession();
  const [bookings, settings] = await Promise.all([
    getBookings(),
    getCafeSettings(),
  ]);
  return <BookingsManagerClient initialBookings={bookings} settings={settings} />;
}
