import React from "react";
import ProductManagerClient from "@/components/admin/ProductManagerClient";
import { getProducts, getCategories } from "@/lib/db";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductManagerClient initialProducts={products} categories={categories} />;
}
