import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { serializeCattle } from "@/lib/serialize";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CattleDetailClient from "@/components/public/CattleDetailClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cattle = await prisma.cattle.findUnique({ where: { id } });
  if (!cattle) return { title: "Sapi Tidak Ditemukan" };
  return {
    title: `Sapi ${cattle.breed} (${cattle.tagNumber}) | Daengmakku`,
    description: `Detail sapi qurban ${cattle.breed} dengan bobot ${cattle.weight} kg. Lihat video penimbangan dan hubungi admin.`,
  };
}

export default async function CattleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await prisma.cattle.findUnique({ where: { id } });

  if (!raw) notFound();

  const cattle = serializeCattle(raw);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-grow">
        <CattleDetailClient cattle={cattle} />
      </main>
      <Footer />
    </div>
  );
}
