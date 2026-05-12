"use client";

import { SerializedCattle } from "@/lib/serialize";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Weight, CalendarDays, Tag, MessageCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CattleDetailClientProps {
  cattle: SerializedCattle;
}

export default function CattleDetailClient({ cattle }: CattleDetailClientProps) {
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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatAge = (months: number) => {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${months} Bulan`;
    if (rem === 0) return `${years} Tahun`;
    return `${years} Tahun ${rem} Bulan`;
  };

  const currentUrl = isMounted ? window.location.href : "";
  const whatsappMessage = encodeURIComponent(
    `Halo Admin Daengmakku, saya tertarik dengan sapi jenis *${cattle.breed}* dengan nomor tag *${cattle.tagNumber}*. Apakah masih tersedia? Berikut linknya: ${currentUrl}`
  );

  const admins = [
    { name: "Abyan", phone: "6282113371878" },
    { name: "Arka", phone: "628170020301" },
    { name: "Ust Ghois", phone: "6287880851190" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md">
            {imageUrls.length > 0 ? (
              <>
                <img
                  src={imageUrls[activeImageIndex]}
                  alt={`Sapi ${cattle.tagNumber}`}
                  className="w-full h-full object-cover"
                />
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((i) => (i + 1) % imageUrls.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-8xl">
                🐄
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imageUrls.map((url: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImageIndex ? "border-emerald-500 shadow-md" : "border-transparent"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* YouTube Video */}
          {/* YouTube Video */}
          {youtubeUrls.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-red-500 text-lg">▶</span>
                Video Penimbangan ({youtubeUrls.length})
              </h3>
              {youtubeUrls.map((ytId: string, idx: number) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title={`Video Penimbangan Sapi ${idx + 1}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            {cattle.status === "AVAILABLE" ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                <CheckCircle className="h-4 w-4" /> Tersedia
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                <XCircle className="h-4 w-4" /> Terjual
              </span>
            )}
            <span className="text-sm text-gray-400">Tag: <strong className="text-gray-700">{cattle.tagNumber}</strong></span>
          </div>

          {/* Name & Price */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{cattle.breed}</h1>
            <p className="text-3xl font-bold text-emerald-700 mt-3">
              {formatCurrency(Number(cattle.price))}
            </p>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Spesifikasi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Weight className="h-3.5 w-3.5 text-emerald-600" /> Bobot
                </p>
                <p className="font-bold text-gray-900 text-lg">{cattle.weight} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-emerald-600" /> Umur
                </p>
                <p className="font-bold text-gray-900 text-lg">{formatAge(cattle.ageInMonths)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-emerald-600" /> Nomor Tag
                </p>
                <p className="font-bold text-gray-900 text-lg">{cattle.tagNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Jenis</p>
                <p className="font-bold text-gray-900 text-lg">{cattle.breed}</p>
              </div>
            </div>
          </div>

          {/* Transparency note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
            <p className="font-semibold mb-1">🎥 Transparansi Penimbangan</p>
            <p className="text-emerald-700">
              {youtubeUrls.length > 0
                ? "Video penimbangan tersedia. Bobot yang tertera adalah hasil timbangan langsung yang bisa Anda saksikan."
                : "Foto dokumentasi asli sapi ini tersedia di katalog kami."}
            </p>
          </div>

          {/* CTA */}
          {cattle.status === "AVAILABLE" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Hubungi Admin untuk Pemesanan:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {admins.map((admin) => (
                  <a
                    key={admin.phone}
                    href={`https://wa.me/${admin.phone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all hover:shadow-md active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat {admin.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> Lihat Sapi Lainnya
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
