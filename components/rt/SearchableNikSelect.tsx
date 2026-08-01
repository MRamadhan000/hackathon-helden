"use client";

import React, { useState, useRef, useEffect } from "react";
import { PendudukRT } from "./TableWarga";

interface SearchableNikSelectProps {
  daftarWarga: PendudukRT[];
  selectedNik: string;
  onSelectNik: (nik: string) => void;
}

export default function SearchableNikSelect({
  daftarWarga,
  selectedNik,
  onSelectNik,
}: SearchableNikSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cari data warga yang saat ini terpilih
  const selectedWarga = daftarWarga.find((w) => w.nik === selectedNik);

  // Filter warga berdasarkan pengetikan NIK atau Nama secara real-time
  const filteredWarga = daftarWarga.filter((w) => {
    const term = searchTerm.toLowerCase();
    return (
      w.nik.toLowerCase().includes(term) || w.nama.toLowerCase().includes(term)
    );
  });

  // Tanda bila klik di luar area dropdown untuk menutup menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input / Box Pencarian Utama */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 font-mono font-bold text-slate-900 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition cursor-pointer flex items-center justify-between"
      >
        <input
          type="text"
          placeholder="Ketik NIK atau Nama untuk mencari (contoh: 3507)..."
          value={
            isOpen
              ? searchTerm
              : selectedNik
                ? `${selectedWarga?.nik} - ${selectedWarga?.nama}`
                : ""
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          className="w-full bg-transparent border-none outline-none font-mono font-bold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
        />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Popover / List Menu Dropdown Hasil Filter */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100">
          {filteredWarga.length > 0 ? (
            filteredWarga.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  onSelectNik(w.nik);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`p-3 text-xs cursor-pointer hover:bg-blue-50 transition flex items-center justify-between ${
                  selectedNik === w.nik ? "bg-blue-50/80 font-bold" : ""
                }`}
              >
                <div>
                  <span className="font-mono font-bold text-slate-900 block">
                    {w.nik}
                  </span>
                  <span className="text-slate-600">{w.nama}</span>
                </div>
                {selectedNik === w.nik && (
                  <span className="text-blue-600 font-bold text-xs">
                    ✓ Terpilih
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-xs text-slate-400 text-center italic">
              Tidak ada NIK/Nama yang cocok dengan "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
