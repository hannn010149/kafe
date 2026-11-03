"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, Clock, Download } from "lucide-react";

interface QRISModalProps {
  orderCode: string;
  totalAmount: number;
  cafeName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function QRISModal({
  orderCode,
  totalAmount,
  cafeName,
  onSuccess,
  onClose,
}: QRISModalProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSimulatePayment = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E8DDCB] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* QRIS Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="font-extrabold text-red-600 text-lg tracking-wider">QRIS</span>
          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">
            Standar Pembayaran Nasional
          </span>
        </div>

        <h3 className="font-bold text-[#232724] text-base">{cafeName}</h3>
        <p className="text-xs text-[#7E8680] mt-0.5">Kode: {orderCode}</p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-[#FAF7F2] rounded-2xl border-2 border-dashed border-[#C5D8C6] inline-block shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://komorebi.cafe/pay/${orderCode}?amount=${totalAmount}`}
            alt="QRIS Komorebi Cafe"
            className="w-48 h-48 mx-auto rounded-lg mix-blend-multiply"
          />
          <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-[#536B54] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NMID: ID1029384756182</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-[#FAF7F2] py-2 px-4 rounded-xl border border-[#E8DDCB] mb-3">
          <span className="text-xs text-[#7E8680] block">Total Tagihan</span>
          <span className="text-xl font-extrabold text-[#536B54]">
            Rp {totalAmount.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-medium mb-5">
          <Clock className="w-4 h-4 animate-spin text-amber-600" />
          <span>Selesaikan dalam {formatTimer(timeLeft)}</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={verifying}
          className="w-full bg-[#536B54] hover:bg-[#425543] text-white py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          {verifying ? (
            <span>Memverifikasi Pembayaran...</span>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saya Sudah Membayar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

