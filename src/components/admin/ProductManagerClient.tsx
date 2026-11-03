"use client";

import React, { useState, useEffect } from "react";
import { Product, Category, ImageSearchResult } from "@/types";
import {
  Plus,
  Search,
  Sparkles,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface ProductManagerClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductManagerClient({
  initialProducts,
  categories,
}: ProductManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [price, setPrice] = useState<number>(35000);
  const [stock, setStock] = useState<number>(50);
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [calories, setCalories] = useState<number>(120);

  // Automatic Image Search State
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageSuggestions, setImageSuggestions] = useState<ImageSearchResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger automatic image search whenever product name changes
  const handleAutoSearchImages = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length < 2) return;
    setIsSearchingImages(true);
    setUploadError(null);

    try {
      const res = await fetch(`/api/admin/search-images?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (data.success && data.images && data.images.length > 0) {
        setImageSuggestions(data.images);
        // Automatically select the first suggestion if no image is chosen yet
        if (!imageUrl) {
          setImageUrl(data.images[0].url);
        }
      }
    } catch (err) {
      console.warn("Auto image search error:", err);
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah foto");
      setImageUrl(data.url);
      setToastMessage("Foto berhasil diunggah!");
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setNameEn("");
    setCategoryId(categories[0]?.id || "");
    setPrice(35000);
    setStock(50);
    setDescription("");
    setDescriptionEn("");
    setImageUrl("");
    setIsAvailable(true);
    setIsFeatured(false);
    setIsPopular(false);
    setIsNew(false);
    setCalories(120);
    setImageSuggestions([]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameEn(p.name_en || "");
    setCategoryId(p.category_id);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setDescriptionEn(p.description_en || "");
    setImageUrl(p.image_url);
    setIsAvailable(p.is_available);
    setIsFeatured(p.is_featured);
    setIsPopular(p.is_popular);
    setIsNew(p.is_new || false);
    setCalories(p.calories || 0);
    setImageSuggestions([]);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) {
      alert("Nama produk, harga, dan foto wajib diisi!");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        name_en: nameEn || undefined,
        category_id: categoryId,
        price,
        stock,
        description,
        description_en: descriptionEn || undefined,
        image_url: imageUrl,
        is_available: isAvailable,
        is_featured: isFeatured,
        is_popular: isPopular,
        is_new: isNew,
        calories,
      };

      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
        setToastMessage("Produk berhasil diperbarui!");
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProducts((prev) => [data.product, ...prev]);
        setToastMessage("Produk baru berhasil disimpan!");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus produk");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setToastMessage("Produk berhasil dihapus!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleAvailability = async (p: Product) => {
    const updated = !p.is_available;
    try {
      await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: updated }),
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_available: updated } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category_id === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#232724] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs border border-[#536B54] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#889E73]" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Pengelolaan Produk Kafe
          </h1>
          <p className="text-xs text-[#7E8680]">
            Tambah, edit harga, kelola stok, dan gunakan fitur unggulan pencarian foto otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#536B54] hover:bg-[#425543] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative grow w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8680]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk atau bahan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-white rounded-xl border border-[#E8DDCB] text-xs focus:outline-none focus:border-[#536B54]"
        >
          <option value="all">Semua Kategori ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DDCB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DDCB] text-[#7E8680] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga (IDR)</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Status Ketersediaan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1ECE1]">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Product Media & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#F3ECE0] shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#232724] block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-[#7E8680] line-clamp-1">
                            {p.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#4B524D]">
                      <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DDCB]">
                        {cat?.name || "Kategori"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#232724]">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${p.stock < 10 ? "text-red-600" : "text-[#4B524D]"}`}>
                        {p.stock} porsi
                      </span>
                    </td>

                    {/* Availability Switch */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          p.is_available
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {p.is_available ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-700" />
                            <span>Tersedia</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-500" />
                            <span>Habis</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-[#7E8680] hover:text-[#536B54] hover:bg-[#FAF7F2] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL (WITH AUTOMATIC IMAGE SEARCH) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DDCB] max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1ECE1]">
              <div>
                <h3 className="text-lg font-bold text-[#232724]">
                  {editingProduct ? "Edit Produk Kafe" : "Tambah Produk Baru"}
                </h3>
                <p className="text-xs text-[#7E8680]">
                  Gunakan fitur deteksi foto otomatis hanya dengan mengetikkan nama produk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Product Name with Automatic Image Trigger */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#7E8680]">
                    Nama Produk (Bahasa Indonesia) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoSearchImages(name)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#536B54] hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#889E73]" />
                    <span>Cari Foto Otomatis</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    // Automatic auto-trigger if user finishes typing or after 3 letters
                    if (e.target.value.length >= 3 && !imageUrl) {
                      handleAutoSearchImages(e.target.value);
                    }
                  }}
                  placeholder="Contoh: Iced Matcha Latte, Dorayaki, Souffle Pancake..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              {/* Automatic Image Search Suggestions Panel */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DDCB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#232724] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#889E73]" />
                    <span>Saran Foto Otomatis (Klik untuk Memilih)</span>
                  </span>
                  {isSearchingImages && (
                    <span className="text-xs text-[#536B54] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Mencari...
                    </span>
                  )}
                </div>

                {imageSuggestions.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imageSuggestions.map((img, i) => {
                      const isSelected = imageUrl === img.url;
                      return (
                        <div
                          key={i}
                          onClick={() => setImageUrl(img.url)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected
                              ? "border-[#536B54] ring-2 ring-[#536B54]/40"
                              : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img.thumbnail_url}
                            alt={img.title}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#536B54] text-white w-5 h-5 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected Image Preview & Manual Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  {imageUrl ? (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#E8DDCB] grow w-full sm:w-auto">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover bg-[#F3ECE0]"
                      />
                      <div className="text-xs truncate grow">
                        <span className="font-semibold text-[#232724] block">Foto Terpilih</span>
                        <span className="text-[10px] text-[#7E8680] truncate block">{imageUrl}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#7E8680] italic">Belum ada foto yang dipilih.</div>
                  )}

                  {/* Manual file upload button */}
                  <label className="cursor-pointer bg-white border border-[#E8DDCB] hover:bg-[#FAF7F2] text-[#4B524D] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#536B54]" />
                    <span>{isUploading ? "Mengunggah..." : "Upload Manual"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleManualUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category, Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Kategori *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Harga (IDR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7E8680]">Stok Porsi</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7E8680]">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan cita rasa, bahan baku khas, atau keunikan sajian ini..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#536B54]"
                />
              </div>

              {/* English Name & Description for Multilingual */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DDCB] space-y-2">
                <span className="text-[11px] font-bold text-[#7E8680] uppercase tracking-wider block">
                  Informasi Versi Bahasa Inggris (Multilingual)
                </span>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="English Product Name (e.g. Ceremonial Matcha Latte)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] text-xs bg-white focus:outline-none focus:border-[#536B54]"
                />
              </div>

              {/* Checkboxes: Featured, Popular, New */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-[#4B524D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded text-[#536B54] focus:ring-[#536B54]"
                  />
                  <span>Menu Terlaris (Popular)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#4B524D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#536B54] focus:ring-[#536B54]"
                  />
                  <span>Menu Rekomendasi (Featured)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#4B524D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded text-[#536B54] focus:ring-[#536B54]"
                  />
                  <span>Menu Baru (New Arrival)</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-[#F1ECE1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E8DDCB] text-xs font-semibold text-[#4B524D] hover:bg-[#FAF7F2]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#536B54] hover:bg-[#425543] text-white px-7 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Produk ke Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

