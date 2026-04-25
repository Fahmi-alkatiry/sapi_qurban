import { PrismaClient } from "@prisma/client";
import { serializeCattleList } from "@/lib/serialize";
import CatalogClient from "@/components/public/CatalogClient";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

const prisma = new PrismaClient();

export const metadata = {
  title: "Katalog Sapi Qurban | Daengmakku",
  description: "Temukan sapi qurban pilihan Anda. Katalog digital transparan dengan video penimbangan dan informasi lengkap.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rawCattle = await prisma.cattle.findMany({
    orderBy: { createdAt: "desc" },
  });
  const cattle = serializeCattleList(rawCattle);

  // Get unique breeds for filter
  const breeds = [...new Set(cattle.map((c) => c.breed))];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-emerald-300 text-sm font-semibold tracking-widest uppercase mb-4">
              Daengmakku Cattle
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Sapi Qurban <br />
              <span className="text-emerald-300">Berkualitas Terpercaya</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Setiap sapi dilengkapi video penimbangan langsung sebagai bukti nyata. 
              Pilih dengan tenang, qurban dengan yakin.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-medium">
                🐄 {cattle.filter(c => c.status === "AVAILABLE").length} Sapi Tersedia
              </div>
              <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-medium">
                📹 Video Penimbangan
              </div>
              <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-medium">
                ✅ Transparan & Terpercaya
              </div>
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <CatalogClient cattle={cattle} breeds={breeds} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
