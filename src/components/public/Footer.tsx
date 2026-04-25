"use client";

import { Camera, MapPin, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const admins = [
    { name: "Abyan", phone: "6282113371878" },
    { name: "Arka", phone: "628170020301" },
    { name: "Ust Ghois", phone: "6287880851190" },
  ];

  const mapsUrl = "https://www.google.com/maps/place/Sapi+Qurban+Daeng+Makku/@-6.3323686,106.8076665,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f300711d2917:0x85a47e9a136f001b!8m2!3d-6.3323686!4d106.8076665!16s%2Fg%2F11y4ydtf8k!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D";
  const igUrl = "https://instagram.com/sapiqurbandaengmakku";

  return (
    <footer className="bg-emerald-900 text-emerald-100 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Branding & Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Daeng Makku" className="h-14 w-auto brightness-0 invert" />
            <div>
              <p className="font-bold text-white text-xl">Daengmakku Cattle</p>
              <p className="text-emerald-300 text-sm">Sapi Qurban Berkualitas</p>
            </div>
          </div>
          <p className="text-emerald-200/80 leading-relaxed max-w-sm">
            Penyedia sapi qurban terpercaya dengan transparansi penuh. 
            Setiap sapi memiliki video penimbangan langsung untuk menjamin keakuratan bobot.
          </p>
          <div className="flex gap-4">
            <a 
              href={igUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-colors text-white"
              title="Instagram"
            >
              <Camera className="h-5 w-5" />
            </a>
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-colors text-white"
              title="Lokasi Maps"
            >
              <MapPin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Admins / Contact */}
        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-emerald-400" />
            Hubungi Admin
          </h3>
          <div className="grid gap-4">
            {admins.map((admin) => (
              <a
                key={admin.phone}
                href={`https://wa.me/${admin.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/50 rounded-xl transition-all group"
              >
                <div>
                  <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Admin</p>
                  <p className="font-semibold text-white">{admin.name}</p>
                </div>
                <MessageCircle className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Location Preview */}
        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-400" />
            Lokasi Kandang
          </h3>
          <div className="rounded-2xl overflow-hidden border border-emerald-700/50 h-48 bg-emerald-800/30 relative group">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <p className="text-sm text-emerald-200">Kunjungi kandang kami untuk melihat langsung sapi pilihan Anda.</p>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-900 font-bold rounded-lg text-sm hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-emerald-800/50 text-center">
        <p className="text-emerald-500 text-sm">
          &copy; {new Date().getFullYear()} Daengmakku Cattle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
