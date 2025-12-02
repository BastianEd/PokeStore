/**
 * @interface SaleItem
 * @description Define la estructura de un ítem individual dentro de un registro de venta.
 * Contiene los detalles del Pokémon vendido y la cantidad.
 */
export interface SaleItem {
  pokedexId: number;
  nombre: string;
  imagen: string;
  tipoPrincipal?: string;
  quantity: number;
  precio: number;
}

/**
 * @interface SaleRecord
 * @description Define la estructura de un registro de venta completo.
 * Incluye un identificador, la fecha, el ID del usuario que realizó la compra y un array de los ítems vendidos.
 */
export interface SaleRecord {
  id: number;
  fecha: string;
  userId: string;
  items: SaleItem[];
}

/**
 * @description Extrae el ID de usuario de una clave de `localStorage`.
 * Las claves de compras se almacenan con el formato `compras_user_{ID}`. Esta función
 * valida el prefijo y devuelve el ID si la clave coincide con el formato esperado.
 * @param {string} key - La clave de `localStorage` a parsear.
 * @returns {string | null} El ID del usuario como string, o `null` si la clave no es válida.
 */
function parseUserIdFromKey(key: string): string | null {
  const prefix = "compras_user_";
  if (!key.startsWith(prefix)) return null;
  const userId = key.slice(prefix.length);
  return userId || null;
}

/**
 * @description Objeto `SalesService` que encapsula la lógica para obtener los registros de ventas.
 *
 * En esta implementación de **demostración**, el servicio no se comunica con un backend,
 * sino que **simula la obtención de datos leyendo y procesando la información almacenada en `localStorage`**.
 * Agrega los registros de compras de todos los usuarios guardados localmente.
 */
export const SalesService = {
  /**
   * @description Obtiene y consolida todos los registros de ventas almacenados en `localStorage`.
   *
   * El método itera sobre todas las claves de `localStorage`, identifica aquellas que corresponden
   * a historiales de compras (`compras_user_*`), parsea su contenido JSON y las agrega a una
   * lista consolidada. Finalmente, ordena todos los registros de venta de forma cronológica descendente.
   *
   * @returns {Promise<SaleRecord[]>} Una promesa que se resuelve con un array de todos los registros de venta.
   * Devuelve un array vacío si se ejecuta en un entorno sin `window` (SSR) o si no hay ventas.
   */
  async getAll(): Promise<SaleRecord[]> {
    // Guard clause para entornos de renderizado en servidor (SSR).
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
        
        // Parseamos el contenido, que es un array de compras para ese usuario.
        const userSales = JSON.parse(raw) as Array<{ id: number; fecha: string; items: SaleItem[] }>;
        
        // Agregamos cada compra a la lista general, enriqueciéndola con el `userId`.
        for (const sale of userSales) {
          records.push({ ...sale, userId });
        }
      } catch (error) {
        // Si hay un error de parseo, simplemente ignoramos esa clave y continuamos.
        console.error(`Error al parsear la clave de localStorage '${key}':`, error);
      }
    }

    // Ordenamos todos los registros de más reciente a más antiguo antes de devolverlos.
    records.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return records;
  },
};