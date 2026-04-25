import { getCattleList } from "@/app/actions/cattle";
import CattleTable from "@/components/admin/CattleTable";
import { CattleFormDialog } from "@/components/admin/CattleFormDialog";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getCattleList();
  const cattle = result.success ? result.data : [];

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Sapi</h2>
          <p className="text-sm text-gray-500">Kelola daftar sapi kurban, harga, dan ketersediaan.</p>
        </div>
        <CattleFormDialog />
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <CattleTable initialData={cattle || []} />
      </div>
    </div>
  );
}
