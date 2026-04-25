import { Cattle, Status } from "@prisma/client";

// Plain serializable cattle type (price as number, not Decimal)
export type SerializedCattle = Omit<Cattle, "price" | "createdAt" | "updatedAt"> & {
  price: number;
  createdAt: string;
  updatedAt: string;
};

export function serializeCattle(cattle: Cattle): SerializedCattle {
  return {
    ...cattle,
    price: Number(cattle.price),
    createdAt: cattle.createdAt.toISOString(),
    updatedAt: cattle.updatedAt.toISOString(),
  };
}

export function serializeCattleList(list: Cattle[]): SerializedCattle[] {
  return list.map(serializeCattle);
}
