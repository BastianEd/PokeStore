export interface SaleItem {
  pokedexId: number;
  nombre: string;
  imagen: string;
  tipoPrincipal?: string;
  quantity: number;
  precio: number;
}

export interface SaleRecord {
  id: number;
  fecha: string;
  userId: string;
  items: SaleItem[];
}

function parseUserIdFromKey(key: string): string | null {
  const prefix = "compras_user_";
  if (!key.startsWith(prefix)) return null;
  const userId = key.slice(prefix.length);
  return userId || null;
}

export const SalesService = {
  async getAll(): Promise<SaleRecord[]> {
    if (typeof window === "undefined") return [];

    const records: SaleRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const userId = parseUserIdFromKey(key);
      if (userId == null) continue;

      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const arr = JSON.parse(raw) as Array<{ id: number; fecha: string; items: SaleItem[] }>;
        for (const rec of arr) {
          records.push({ ...rec, userId });
        }
      } catch {

      }
    }

    records.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return records;
  },
};
