"use server";

import { PrismaClient, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { serializeCattle, serializeCattleList } from "@/lib/serialize";
import { extractYoutubeId } from "@/lib/utils";

const prisma = new PrismaClient();

export async function getCattleList() {
  try {
    const cattle = await prisma.cattle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: serializeCattleList(cattle) };
  } catch (error) {
    console.error("Failed to fetch cattle:", error);
    return { success: false, error: "Gagal mengambil data sapi" };
  }
}

export async function getCattleById(id: string) {
  try {
    const cattle = await prisma.cattle.findUnique({
      where: { id },
    });
    return { success: true, data: cattle ? serializeCattle(cattle) : null };
  } catch (error) {
    console.error("Failed to fetch cattle by id:", error);
    return { success: false, error: "Gagal mengambil data sapi" };
  }
}

export async function createCattle(formData: FormData) {
  try {
    const tagNumber = formData.get("tagNumber") as string;
    const breed = formData.get("breed") as string;
    const weight = parseFloat(formData.get("weight") as string);
    const ageInMonths = parseInt(formData.get("ageInMonths") as string);
    const price = formData.get("price") as string;
    const youtubeUrlsString = formData.get("youtubeUrls") as string;
    const rawYoutubeUrls = youtubeUrlsString ? JSON.parse(youtubeUrlsString) : [];
    const youtubeUrls = Array.isArray(rawYoutubeUrls) 
      ? rawYoutubeUrls.map((url: string) => extractYoutubeId(url)).filter(Boolean) 
      : [];
    const imageUrlsString = formData.get("imageUrls") as string;
    const imageUrls = imageUrlsString ? JSON.parse(imageUrlsString) : [];

    const newCattle = await prisma.cattle.create({
      data: {
        tagNumber,
        breed,
        weight,
        ageInMonths,
        price,
        youtubeUrls,
        imageUrls,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true, data: serializeCattle(newCattle) };
  } catch (error: any) {
    console.error("Failed to create cattle:", error);
    if (error.code === 'P2002') {
       return { success: false, error: "Nomor Tag sudah digunakan" };
    }
    return { success: false, error: "Gagal menambahkan sapi baru" };
  }
}

export async function updateCattle(id: string, formData: FormData) {
  try {
    const tagNumber = formData.get("tagNumber") as string;
    const breed = formData.get("breed") as string;
    const weight = parseFloat(formData.get("weight") as string);
    const ageInMonths = parseInt(formData.get("ageInMonths") as string);
    const price = formData.get("price") as string;
    const youtubeUrlsString = formData.get("youtubeUrls") as string;
    const rawYoutubeUrls = youtubeUrlsString ? JSON.parse(youtubeUrlsString) : [];
    const youtubeUrls = Array.isArray(rawYoutubeUrls) 
      ? rawYoutubeUrls.map((url: string) => extractYoutubeId(url)).filter(Boolean) 
      : [];
    const imageUrlsString = formData.get("imageUrls") as string;
    const imageUrls = imageUrlsString ? JSON.parse(imageUrlsString) : [];

    const updatedCattle = await prisma.cattle.update({
      where: { id },
      data: {
        tagNumber,
        breed,
        weight,
        ageInMonths,
        price,
        youtubeUrls,
        imageUrls,
        // Status is NOT updated here — use the dedicated "Tandai Terjual" button
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    revalidatePath(`/sapi/${id}`);
    
    return { success: true, data: serializeCattle(updatedCattle) };
  } catch (error: any) {
    console.error("Failed to update cattle:", error);
    if (error.code === 'P2002') {
       return { success: false, error: "Nomor Tag sudah digunakan" };
    }
    return { success: false, error: "Gagal memperbarui data sapi" };
  }
}

export async function deleteCattle(id: string) {
  try {
    await prisma.cattle.delete({
      where: { id },
    });
    
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete cattle:", error);
    return { success: false, error: "Gagal menghapus sapi" };
  }
}

export async function markAsSold(id: string) {
  try {
    await prisma.cattle.update({
      where: { id },
      data: { status: "SOLD" },
    });
    
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    revalidatePath(`/sapi/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Gagal mengubah status sapi" };
  }
}

export async function markAsAvailable(id: string) {
  try {
    await prisma.cattle.update({
      where: { id },
      data: { status: "AVAILABLE" },
    });
    
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    revalidatePath(`/sapi/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Gagal membatalkan status terjual" };
  }
}
