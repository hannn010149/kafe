import React from "react";
import CategoryManagerClient from "@/components/admin/CategoryManagerClient";
import { getCategories } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManagerClient initialCategories={categories} />;
}

