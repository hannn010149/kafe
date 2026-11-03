import React from "react";
import SettingsClient from "@/components/admin/SettingsClient";
import { getCafeSettings } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await getCafeSettings();
  return <SettingsClient initialSettings={settings} />;
}

