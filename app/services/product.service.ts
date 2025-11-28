import api from "./api";
import type { Pokemon } from "~/data/products";

// Definimos la interfaz EXACTA de cómo vienen los datos del Backend
interface BackendPokemon {
    id: number;
    nombre: string;
    tipo: string;
    imagenUrl: string | null;
    precio: number;
    descripcion: string;
}

export const ProductService = {
    /**
     * Obtiene la lista y ADAPTA los datos para que el Frontend los entienda.
     */
    getAll: async (): Promise<Pokemon[]> => {
        try {
            const response = await api.get<BackendPokemon[]>("/v2/pokemones"); // Recuerda usar v2

            const adaptados: Pokemon[] = response.data.map((item) => ({
                pokedexId: item.id,
                nombre: item.nombre,
                tipoPrincipal: item.tipo,
                precio: item.precio,
                imagen: item.imagenUrl || "app/assets/img/pokeball.webp",
                // 👇 Usamos la descripción real. Si viene vacía, fallback.
                descripcion: item.descripcion || "Descripción no disponible.",
                destacado: false
            }));

            return adaptados;
        } catch (error) {
            console.error("Error en ProductService.getAll:", error);
            throw error;
        }
    },

    /**
     * Busca por ID y adapta la respuesta.
     */
    getById: async (id: number): Promise<Pokemon> => {
        const response = await api.get<BackendPokemon>(`/v2/pokemones/${id}`);
        const item = response.data;

        return {
            pokedexId: item.id,
            nombre: item.nombre,
            tipoPrincipal: item.tipo,
            precio: item.precio,
            imagen: item.imagenUrl || "app/assets/img/pokeball.png",
            descripcion: "Detalle cargado desde la API.",
            destacado: false
        };
    }
};