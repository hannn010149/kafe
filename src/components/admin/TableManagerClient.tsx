"use client";

import React, { useState } from "react";
import { Table } from "@/types";
import { Plus, Armchair, Edit, Trash2, CheckCircle2, X } from "lucide-react";

interface TableManagerClientProps {
  initialTables: Table[];
}

export default function TableManagerClient({ initialTables }: TableManagerClientProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [tableNumber, setTableNumber] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number>(4);
  const [area, setArea] = useState<Table["area"]>("tatami");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingTable(null);
    setTableNumber(`T-0${tables.length + 1}`);
    setName("");
    setCapacity(4);
    setArea("tatami");
    setDescription("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (t: Table) => {
    setEditingTable(t);
    setTableNumber(t.table_number);
    setName(t.name);
    setCapacity(t.capacity);
    setArea(t.area);
    setDescription(t.description || "");
    setIsActive(t.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        table_number: tableNumber,
        name,
        capacity: Number(capacity),
        area,
        description,
        is_active: isActive,
      };

      if (editingTable) {
        const res = await fetch(`/api/tables/${editingTable.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTables((prev) =>
          prev.map((item) => (item.id === editingTable.id ? data.table : item))
        );
      } else {
        const res = await fetch("/api/tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTables((prev) => [...prev, data.table]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus meja ini?")) return;
    try {
      const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus meja");
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Pengelolaan Meja & Tata Ruang Kafe
          </h1>
          <p className="text-xs text-[#7E8680]">
            Atur kapasitas meja duduk, area tatami, dining hall, taman zen, dan bar counter.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="bg-[#536B54] hover:bg-[#425543] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Meja Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((tbl) => (
          <div
            key={tbl.id}
            className="bg-white p-5 rounded-3xl border border-[#E8DDCB] shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-[#536B54]">
                  Meja {tbl.table_number}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    tbl.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tbl.is_active ? "Aktif" : "Non-aktif"}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#232724] mt-2">{tbl.name}</h3>
              <p className="text-xs text-[#7E8680]">
                Kapasitas: <strong>{tbl.capacity} Orang</strong> • Area:{" "}
                <span className="capitalize">{tbl.area.replace("_", " ")}</span>
              </p>
              {tbl.description && (
                <p className="text-[11px] text-[#4B524D] mt-1 line-clamp-2">
                  {tbl.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#F1ECE1] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openEdit(tbl)}
                className="p-1.5 rounded-lg text-[#7E8680] hover:text-[#536B54] hover:bg-[#FAF7F2]"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tbl.id)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E8DDCB] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#F1ECE1]">
              <h3 className="text-base font-bold text-[#232724]">
                {editingTable ? "Edit Meja" : "Tambah Meja Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Nomor Meja *</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: T-01, M-02"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Nama Meja *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Tatami Zen Room A"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#7E8680] block mb-1">Kapasitas Tamu</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#7E8680] block mb-1">Area Tempat Duduk</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value as Table["area"])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                  >
                    <option value="tatami">Tatami Room</option>
                    <option value="main_hall">Main Dining Hall</option>
                    <option value="garden_terrace">Garden Terrace</option>
                    <option value="bar_counter">Bar Counter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#7E8680] block mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FAF7F2]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  {saving ? "Menyimpan..." : "Simpan Meja"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

