"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { Plus, Edit, Trash2, X, Database, LoaderCircle } from "lucide-react";

interface CategoryManagerClientProps {
  initialCategories: Category[];
}

export default function CategoryManagerClient({
  initialCategories,
}: CategoryManagerClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [importingSeed, setImportingSeed] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const handleImportSeed = async () => {
    setImportingSeed(true);
    setImportMessage("");
    try {
      const response = await fetch("/api/admin/seed-catalog", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal mengimpor data awal.");

      const categoriesResponse = await fetch("/api/categories", { cache: "no-store" });
      const categoriesResult = await categoriesResponse.json();
      if (!categoriesResponse.ok) {
        throw new Error(categoriesResult.error || "Data kategori berhasil diimpor, tetapi gagal dimuat ulang.");
      }
      setCategories(categoriesResult.categories);
      setImportMessage(
        `Impor selesai: ${result.categoriesInserted} kategori dan ${result.productsInserted} produk ditambahkan; ` +
        `${result.categoriesSkipped} kategori dan ${result.productsSkipped} produk yang sudah ada dilewati.`
      );
      router.refresh();
    } catch (error: unknown) {
      setImportMessage(error instanceof Error ? error.message : "Gagal mengimpor data awal.");
    } finally {
      setImportingSeed(false);
    }
  };

  const openAdd = () => {
    setEditingCategory(null);
    setName("");
    setNameEn("");
    setSlug("");
    setDescription("");
    setDescriptionEn("");
    setSortOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameEn(cat.name_en || "");
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDescriptionEn(cat.description_en || "");
    setSortOrder(cat.sort_order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setSaving(true);

    try {
      const payload = {
        name,
        name_en: nameEn || undefined,
        slug,
        description,
        description_en: descriptionEn || undefined,
        sort_order: Number(sortOrder),
        is_active: true,
      };

      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data.category : c))
        );
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setCategories((prev) => [...prev, data.category]);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus kategori.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Pengelolaan Kategori Menu
          </h1>
          <p className="text-xs text-[#7E8680]">
            Atur kelompok menu kafe (Coffee, Matcha, Dessert, Mains, dll).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleImportSeed}
            disabled={importingSeed}
            className="bg-white hover:bg-[#F4F0E7] disabled:opacity-60 text-[#536B54] border border-[#D8DDCF] px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            {importingSeed ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>{importingSeed ? "Mengimpor..." : "Impor Data Awal"}</span>
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="bg-[#536B54] hover:bg-[#425543] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>
      </div>

      {importMessage && (
        <p role="status" className="rounded-xl border border-[#D8DDCF] bg-white px-4 py-3 text-xs text-[#425543]">
          {importMessage}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-[#E2ECE2] text-[#536B54] px-2 py-0.5 rounded-full font-bold">
                  Urutan #{cat.sort_order}
                </span>
                <span className="text-xs text-[#7E8680] font-mono">/{cat.slug}</span>
              </div>
              <h3 className="font-bold text-base text-[#232724] mt-2">{cat.name}</h3>
              {cat.name_en && (
                <p className="text-xs text-[#7E8680] italic">EN: {cat.name_en}</p>
              )}
              <p className="text-xs text-[#4B524D] mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1ECE1] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openEdit(cat)}
                className="p-1.5 rounded-lg text-[#7E8680] hover:text-[#536B54] hover:bg-[#FAF7F2] transition-colors"
                title="Edit Kategori"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Hapus Kategori"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E8DDCB] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1ECE1]">
              <h3 className="text-base font-bold text-[#232724]">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">
                  Nama Kategori (Indonesia) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">
                  Nama Kategori (English)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Urutan Tampil</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div className="pt-3 border-t border-[#F1ECE1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E8DDCB] text-[#4B524D]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#536B54] text-white px-5 py-2 rounded-full font-semibold"
                >
                  {saving ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
