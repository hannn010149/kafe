import React from "react";
import { getTransactions, getOrders } from "@/lib/db";
import { QrCode, CreditCard, Building } from "lucide-react";

export default async function AdminTransactionsPage() {
  const [transactions, orders] = await Promise.all([
    getTransactions(),
    getOrders(),
  ]);

  const totalAmount = transactions.reduce((acc, it) => acc + it.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232724]">
            Buku Besar & Log Transaksi
          </h1>
          <p className="text-xs text-[#7E8680]">
            Catatan mutasi pembayaran masuk via QRIS, Transfer Bank, dan Kasir Tunai/EDC.
          </p>
        </div>

        <div className="bg-[#536B54] text-white px-4 py-2 rounded-2xl text-xs font-bold">
          Akumulasi: Rp {totalAmount.toLocaleString("id-ID")}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDCB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DDCB] text-[#7E8680] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kode Transaksi</th>
                <th className="py-3.5 px-4">Referensi Pesanan</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Nominal (IDR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1ECE1]">
              {transactions.map((tx) => {
                const order = orders.find((o) => o.id === tx.order_id);
                return (
                  <tr key={tx.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#536B54]">
                      {tx.transaction_code}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B524D]">
                      <span className="font-mono">{order?.order_code || tx.order_id}</span>
                      {order && (
                        <span className="text-[11px] text-[#7E8680] block truncate">
                          {order.customer_name}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 uppercase font-bold text-[11px] text-[#232724]">
                        {tx.payment_method === "qris" ? (
                          <QrCode className="w-3.5 h-3.5 text-[#536B54]" />
                        ) : tx.payment_method === "bank_transfer" ? (
                          <Building className="w-3.5 h-3.5 text-[#8B6B4E]" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span>{tx.payment_method}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#232724]">
                      Rp {tx.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#7E8680]">
                      {new Date(tx.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
