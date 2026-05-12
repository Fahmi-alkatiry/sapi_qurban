"use client";

import { SerializedCattle } from "@/lib/serialize";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Weight, CalendarDays, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CattleCardProps {
  cattle: SerializedCattle;
}

export default function CattleCard({ cattle }: CattleCardProps) {
  const imageUrls =
    typeof cattle.imageUrls === "string"
      ? JSON.parse(cattle.imageUrls)
      : (cattle.imageUrls as string[]) || [];

  // @ts-ignore
  const rawYtUrls = cattle.youtubeUrls;
  const youtubeUrls =
    typeof rawYtUrls === "string"
      ? JSON.parse(rawYtUrls)
      : (rawYtUrls as string[]) || [];

  const firstImage = imageUrls[0] || null;

  const formatAge = (months: number) => {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${months} Bulan`;
    if (rem === 0) return `${years} Tahun`;
    return `${years}t ${rem}b`;
  };

  return (
    <Link
      href={`/sapi/${cattle.id}`}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={`Sapi ${cattle.tagNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-6xl">🐄</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
              cattle.status === "AVAILABLE"
                ? "bg-emerald-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {cattle.status === "AVAILABLE" ? "Tersedia" : "Terjual"}
          </span>
        </div>

        {/* Has video badge */}
        {youtubeUrls.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              📹 Video
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">
              {cattle.breed}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Tag className="h-3 w-3" /> {cattle.tagNumber}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5">
            <Weight className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">{cattle.weight} kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">{formatAge(cattle.ageInMonths)}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-emerald-700 font-bold text-lg">
            {formatCurrency(Number(cattle.price))}
          </p>
        </div>
      </div>
    </Link>
  );
}
