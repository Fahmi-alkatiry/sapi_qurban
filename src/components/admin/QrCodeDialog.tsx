"use client";

import { useState } from "react";
import { SerializedCattle } from "@/lib/serialize";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

interface QrCodeDialogProps {
  cattle: SerializedCattle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrCodeDialog({ cattle, open, onOpenChange }: QrCodeDialogProps) {
  const [size, setSize] = useState("300");

  // Format URL sapi
  // Kita asumsikan URL public detail sapi adalah /sapi/[id]
  const cattleUrl = typeof window !== "undefined" ? `${window.location.origin}/sapi/${cattle.id}` : "";
  
  // GoQR API endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(cattleUrl)}`;

  const handleDownload = () => {
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR-Sapi-${cattle.tagNumber}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("Gagal mengunduh QR Code."));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cetak QR Code</DialogTitle>
          <DialogDescription>
            QR Code untuk sapi <strong>{cattle.tagNumber}</strong>. Pelanggan dapat melakukan scan untuk melihat detail dan video.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="border rounded-md p-4 bg-white shadow-sm">
            {cattleUrl && (
              <img 
                src={qrCodeUrl} 
                alt={`QR Code ${cattle.tagNumber}`} 
                className="w-full h-auto aspect-square object-contain"
                style={{ width: `${Math.min(parseInt(size), 300)}px` }}
              />
            )}
          </div>
          
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-size">Ukuran (Pixel)</Label>
              <div className="flex gap-2">
                <Input 
                  id="qr-size" 
                  type="number" 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)}
                  min="100"
                  max="1000"
                />
                <span className="flex items-center text-sm text-gray-500">px</span>
              </div>
              <p className="text-xs text-gray-500">Gunakan 150px untuk ear tag, atau 500px untuk poster.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Tujuan URL</Label>
              <Input value={cattleUrl} readOnly className="bg-gray-50 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button onClick={handleDownload} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Download className="mr-2 h-4 w-4" /> Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
