import api from "./api";
import type { Pokemon } from "~/data/products";

// DTO para editar (PATCH)
export interface UpdatePokemonDto {
    nombre?: string;
    tipo?: string;
    precio?: number;
    descripcion?: string;
    imagenUrl?: string;
}

// Interfaz de respuesta del Backend
interface BackendPokemon {
    id: number;
    nombre: string;
    tipo: string;
    imagenUrl: string | null;
    precio: number;
    descripcion: string;
}

export const ProductService = {
    // GET: Listar (Funciona bien)
    getAll: async (): Promise<Pokemon[]> => {
        const response = await api.get<BackendPokemon[]>("/v2/pokemones");
        return response.data.map((item) => ({
            pokedexId: item.id,
            nombre: item.nombre,
            tipoPrincipal: item.tipo,
            precio: item.precio,
            imagen: item.imagenUrl || "app/assets/img/pokeball.webp",
            descripcion: item.descripcion || "Sin descripción",
            destacado: false
        }));
    },

    // POST: Crear (Seed)
    seed: async (): Promise<void> => {
        // Endpoint: http://localhost:3000/v2/pokemones/seed
        await api.post("/v2/pokemones/seed");
    },

    // DELETE: Eliminar
    delete: async (id: number): Promise<void> => {
        // Endpoint: http://localhost:3000/v2/pokemones/{id}
        await api.delete(`/v2/pokemones/${id}`);
    },

    // PATCH: Editar
    update: async (id: number, data: UpdatePokemonDto): Promise<void> => {
        // Endpoint: http://localhost:3000/v2/pokemones/{id}
        // NOTA: Si el backend usara PUT, cambiar api.patch por api.put
        await api.patch(`/v2/pokemones/${id}`, data);
    }
};