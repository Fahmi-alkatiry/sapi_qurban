"use client";

import { useState, useMemo } from "react";
import { SerializedCattle } from "@/lib/serialize";
import CattleCard from "./CattleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CatalogClientProps {
  cattle: SerializedCattle[];
  breeds: string[];
}

type SortOption = "newest" | "price-asc" | "price-desc" | "weight-desc";

export default function CatalogClient({ cattle, breeds }: CatalogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result = [...cattle];

    // Filter by search
    if (search.trim()) {
      result = result.filter((c) =>
        c.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.breed.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by breed
    if (selectedBreed !== "all") {
      result = result.filter((c) => c.breed === selectedBreed);
    }

    // Filter available only
    if (showAvailableOnly) {
      result = result.filter((c) => c.status === "AVAILABLE");
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "weight-desc":
        result.sort((a, b) => b.weight - a.weight);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [cattle, search, selectedBreed, showAvailableOnly, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedBreed("all");
    setShowAvailableOnly(false);
    setSortBy("newest");
  };

  const hasFilters = search || selectedBreed !== "all" || showAvailableOnly || sortBy !== "newest";

  return (
    <div>
      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nomor tag atau jenis sapi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Breed filter */}
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="h-10 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Jenis</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga: Termurah</option>
            <option value="price-desc">Harga: Termahal</option>
            <option value="weight-desc">Bobot: Terberat</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Available toggle */}
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border transition-all ${
              showAvailableOnly
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Tersedia Saja
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}

          <span className="ml-auto text-sm text-gray-500 font-medium">
            {filtered.length} sapi ditemukan
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🐄</p>
          <p className="text-lg font-medium text-gray-600">Tidak ada sapi yang sesuai filter</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">Reset Filter</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <CattleCard key={c.id} cattle={c} />
          ))}
        </div>
      )}
    </div>
  );
}
