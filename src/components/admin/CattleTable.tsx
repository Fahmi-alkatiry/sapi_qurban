"use client";

import { useState } from "react";
import { SerializedCattle } from "@/lib/serialize";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, QrCode, CheckCircle, Undo2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteCattle, markAsSold, markAsAvailable } from "@/app/actions/cattle";
import { toast } from "sonner";
import { CattleFormDialog } from "./CattleFormDialog";
import { QrCodeDialog } from "./QrCodeDialog";

interface CattleTableProps {
  initialData: SerializedCattle[];
}

export default function CattleTable({ initialData }: CattleTableProps) {
  const [data, setData] = useState<SerializedCattle[]>(initialData);
  const [editingCattle, setEditingCattle] = useState<SerializedCattle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [qrCattle, setQrCattle] = useState<SerializedCattle | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sapi ini?")) return;
    
    const res = await deleteCattle(id);
    if (res.success) {
      toast.success("Data sapi berhasil dihapus");
      setData(data.filter(c => c.id !== id));
    } else {
      toast.error(res.error || "Gagal menghapus sapi");
    }
  };

  const handleMarkAsSold = async (id: string) => {
    if (!confirm("Ubah status sapi ini menjadi Terjual?")) return;
    
    const res = await markAsSold(id);
    if (res.success) {
      toast.success("Status sapi berhasil diubah");
      setData(data.map(c => c.id === id ? { ...c, status: "SOLD" } : c));
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
  };

  const handleCancelSold = async (id: string) => {
    if (!confirm("Batalkan status Terjual dan ubah menjadi Tersedia?")) return;
    
    const res = await markAsAvailable(id);
    if (res.success) {
      toast.success("Status sapi berhasil dikembalikan menjadi Tersedia");
      setData(data.map(c => c.id === id ? { ...c, status: "AVAILABLE" } : c));
    } else {
      toast.error(res.error || "Gagal membatalkan status terjual");
    }
  };

  const formatAge = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} Bulan`;
    if (remainingMonths === 0) return `${years} Tahun`;
    return `${years} Tahun ${remainingMonths} Bulan`;
  };

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Belum ada data sapi. Silakan tambahkan sapi baru.
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-gray-100">
        {data.map((cattle) => (
          <div key={cattle.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{cattle.tagNumber} - {cattle.breed}</p>
                <p className="text-xs text-gray-500">{cattle.weight} kg · {formatAge(cattle.ageInMonths)}</p>
              </div>
              <Badge variant={cattle.status === "AVAILABLE" ? "default" : "secondary"}
                     className={cattle.status === "AVAILABLE" ? "bg-green-100 text-green-800 border-none text-[10px]" : "bg-gray-100 text-gray-800 border-none text-[10px]"}>
                {cattle.status === "AVAILABLE" ? "Tersedia" : "Terjual"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-emerald-700 text-sm">{formatCurrency(Number(cattle.price))}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQrCattle(cattle)}>
                  <QrCode className="h-4 w-4 text-gray-700" />
                </Button>
                {cattle.status === "AVAILABLE" ? (
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleMarkAsSold(cattle.id)}>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                ) : (
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleCancelSold(cattle.id)}>
                    <Undo2 className="h-4 w-4 text-orange-600" />
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                  setEditingCattle(cattle);
                  setIsEditDialogOpen(true);
                }}>
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDelete(cattle.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Tag</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Bobot</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cattle) => (
              <TableRow key={cattle.id}>
                <TableCell className="font-medium">{cattle.tagNumber}</TableCell>
                <TableCell>{cattle.breed}</TableCell>
                <TableCell>{cattle.weight} kg</TableCell>
                <TableCell>{formatAge(cattle.ageInMonths)}</TableCell>
                <TableCell>{formatCurrency(Number(cattle.price))}</TableCell>
                <TableCell>
                  <Badge variant={cattle.status === "AVAILABLE" ? "default" : "secondary"}
                         className={cattle.status === "AVAILABLE" ? "bg-green-100 text-green-800 hover:bg-green-200 border-none" : "bg-gray-100 text-gray-800 border-none"}>
                    {cattle.status === "AVAILABLE" ? "Tersedia" : "Terjual"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" title="Cetak QR Code" onClick={() => setQrCattle(cattle)}>
                    <QrCode className="h-4 w-4 text-gray-700" />
                  </Button>
                  {cattle.status === "AVAILABLE" ? (
                    <Button variant="outline" size="icon" title="Tandai Terjual" onClick={() => handleMarkAsSold(cattle.id)}>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" title="Batalkan Terjual" onClick={() => handleCancelSold(cattle.id)}>
                      <Undo2 className="h-4 w-4 text-orange-600" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" title="Edit" onClick={() => {
                    setEditingCattle(cattle);
                    setIsEditDialogOpen(true);
                  }}>
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="outline" size="icon" title="Hapus" onClick={() => handleDelete(cattle.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingCattle && (
        <CattleFormDialog 
          cattle={editingCattle} 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditingCattle(null);
          }} 
        />
      )}

      {qrCattle && (
        <QrCodeDialog
          cattle={qrCattle}
          open={!!qrCattle}
          onOpenChange={(open) => !open && setQrCattle(null)}
        />
      )}
    </>
  );
}
