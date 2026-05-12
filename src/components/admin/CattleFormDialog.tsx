"use client";

import { useState, useEffect } from "react";
import { SerializedCattle } from "@/lib/serialize";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCattle, updateCattle } from "@/app/actions/cattle";
import { toast } from "sonner";
import { Plus, X, UploadCloud, Video } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { extractYoutubeId } from "@/lib/utils";

interface CattleFormDialogProps {
  cattle?: SerializedCattle;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CattleFormDialog({ cattle, open: externalOpen, onOpenChange }: CattleFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [newYtInput, setNewYtInput] = useState("");

  useEffect(() => {
    if (cattle && open) {
      setImageUrls(typeof cattle.imageUrls === "string" ? JSON.parse(cattle.imageUrls) : (cattle.imageUrls as string[]) || []);
      
      // @ts-ignore - Handle old or new prisma schema type gracefully
      const ytUrls = cattle.youtubeUrls;
      setYoutubeUrls(typeof ytUrls === "string" ? JSON.parse(ytUrls) : (ytUrls as string[]) || []);
    } else if (!cattle && open) {
      setImageUrls([]);
      setYoutubeUrls([]);
    }
  }, [cattle, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("imageUrls", JSON.stringify(imageUrls));
    formData.append("youtubeUrls", JSON.stringify(youtubeUrls));

    let res;
    if (cattle) {
      res = await updateCattle(cattle.id, formData);
    } else {
      res = await createCattle(formData);
    }

    setLoading(false);

    if (res.success) {
      toast.success(`Data sapi berhasil ${cattle ? "diperbarui" : "ditambahkan"}`);
      setOpen(false);
    } else {
      toast.error(res.error || "Terjadi kesalahan");
    }
  };

  const handleUploadSuccess = (result: any) => {
    if (result.info && result.info.secure_url) {
      setImageUrls((prev) => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!cattle && (
        <DialogTrigger
          render={
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Tambah Sapi
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cattle ? "Edit Data Sapi" : "Tambah Data Sapi Baru"}</DialogTitle>
          <DialogDescription>
            Masukkan detail informasi sapi kurban.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tagNumber">Nomor Tag</Label>
              <Input id="tagNumber" name="tagNumber" defaultValue={cattle?.tagNumber} required placeholder="Contoh: DM-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Jenis Sapi</Label>
              <Input id="breed" name="breed" defaultValue={cattle?.breed} required placeholder="Contoh: Limosin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Bobot (KG)</Label>
              <Input id="weight" name="weight" type="number" step="0.1" defaultValue={cattle?.weight} required placeholder="Contoh: 350.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageInMonths">Umur (Bulan)</Label>
              <Input id="ageInMonths" name="ageInMonths" type="number" defaultValue={cattle?.ageInMonths} required placeholder="Contoh: 24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input id="price" name="price" type="number" defaultValue={cattle?.price?.toString()} required placeholder="Contoh: 25000000" />
            </div>
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label>Video YouTube</Label>
              <div className="flex flex-wrap gap-4 mb-3">
                {youtubeUrls.map((url, index) => {
                  const ytId = extractYoutubeId(url);
                  return (
                    <div key={index} className="relative w-32 h-24 rounded-md border border-gray-200 overflow-hidden group">
                      {ytId ? (
                        <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={`YouTube Preview ${index}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setYoutubeUrls(youtubeUrls.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 items-center">
                <Input 
                  value={newYtInput}
                  onChange={(e) => setNewYtInput(e.target.value)}
                  placeholder="Paste link YouTube di sini..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (newYtInput.trim()) {
                      setYoutubeUrls([...youtubeUrls, newYtInput.trim()]);
                      setNewYtInput("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Video
                </Button>
              </div>
              <p className="text-xs text-gray-500">Anda bisa memasukkan link video penuh atau hanya ID-nya saja.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto Sapi</Label>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24 rounded-md border border-gray-200 overflow-hidden group">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <CldUploadWidget uploadPreset="sapi_qurban" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
            <p className="text-xs text-gray-500">Gunakan Cloudinary Upload Widget. Pastikan nama upload preset sesuai (misal: "sapi_qurban").</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
