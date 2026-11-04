import React from "react";
import CategoryManagerClient from "@/components/admin/CategoryManagerClient";
import { getCategories } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminCategoriesPage() {
  await requireAdminSession();
  const categories = await getCategories();
  return <CategoryManagerClient initialCategories={categories} />;
}
