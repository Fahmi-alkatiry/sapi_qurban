"use client";

import Link from "next/link";
import { Beef } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg text-emerald-800">
          <img src="/logo.png" alt="Logo Daeng Makku" className="h-10 w-auto" />
          <span className="inline text-base sm:text-lg">Sapi Qurban Daeng Makku</span>
        </Link>
        <Link
          href="/admin/login"
          className="text-sm text-gray-500 hover:text-emerald-700 transition-colors"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
