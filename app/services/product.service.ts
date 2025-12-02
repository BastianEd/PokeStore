import api from "./api";
import type { Pokemon } from "~/data/products";

/**
 * @interface UpdatePokemonDto
 * @description Data Transfer Object (DTO) para la actualización parcial de un Pokémon.
 * Define los campos que pueden ser modificados. Al ser todas sus propiedades opcionales,
 * es ideal para operaciones de tipo `PATCH`, donde solo se envían los datos que han cambiado.
 */
export interface UpdatePokemonDto {
    nombre?: string;
    tipo?: string;
    precio?: number;
    descripcion?: string;
    imagenUrl?: string;
}

/**
 * @interface BackendPokemon
 * @description Representa la estructura de datos de un Pokémon tal como la devuelve la API del backend.
 * Sirve como un contrato intermedio antes de mapear los datos a la interfaz `Pokemon` que utiliza el frontend.
 * Esto desacopla la lógica de la aplicación de la estructura específica de la API.
 */
interface BackendPokemon {
    id: number;
    nombre: string;
    tipo: string;
    imagenUrl: string | null;
    precio: number;
    descripcion: string;
}

/**
 * @description Objeto `ProductService` que encapsula toda la lógica de comunicación con la API para la gestión de productos (Pokémon).
 *
 * Este patrón de servicio (Service Pattern) abstrae las llamadas a la API, permitiendo que los componentes
 * de la UI sean agnósticos a los detalles de implementación de la comunicación (endpoints, métodos HTTP, etc.).
 * Todos los métodos son asíncronos y devuelven promesas.
 */
export const ProductService = {
    /**
     * @description Obtiene la lista completa de Pokémon desde el backend.
     * Realiza una transformación de los datos recibidos (`BackendPokemon`) a la estructura de datos
     * que utiliza el frontend (`Pokemon`), manejando diferencias en los nombres de las propiedades y
     * asignando valores por defecto para campos nulos.
     * @returns {Promise<Pokemon[]>} Una promesa que se resuelve con un array de Pokémon para el frontend.
     */
    // GET: /v2/pokemones
    getAll: async (): Promise<Pokemon[]> => {
        const response = await api.get<BackendPokemon[]>("/v2/pokemones");
        // Mapeo de la respuesta del backend a la interfaz del frontend.
        return response.data.map((item) => ({
            pokedexId: item.id,
            nombre: item.nombre,
            tipoPrincipal: item.tipo,
            precio: item.precio,
            imagen: item.imagenUrl || "app/assets/img/pokeball.webp", // Fallback a una imagen local si la URL es nula.
            descripcion: item.descripcion || "Sin descripción", // Fallback para descripciones vacías.
            destacado: false // Propiedad exclusiva del frontend, se inicializa en false.
        }));
    },

    /**
     * @description Solicita al backend que ejecute el proceso de "seeding" para poblar la base de datos con Pokémon.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la operación ha sido aceptada por el servidor.
     */
    // POST: /v2/pokemones/seed
    seed: async (): Promise<void> => {
        await api.post("/v2/pokemones/seed");
    },

    /**
     * @description Elimina un Pokémon de la base de datos a través de la API.
     * @param {number} id - El ID del Pokémon que se va a eliminar.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la eliminación es exitosa.
     */
    // DELETE: /v2/pokemones/{id}
    delete: async (id: number): Promise<void> => {
        // Endpoint: http://localhost:3000/v2/pokemones/{id}
        await api.delete(`/v2/pokemones/${id}`);
    },

    /**
     * @description Actualiza parcialmente los datos de un Pokémon existente.
     * @param {number} id - El ID del Pokémon a actualizar.
     * @param {UpdatePokemonDto} data - Un objeto con los campos a modificar.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la actualización es exitosa.
     */
    // PATCH: /v2/pokemones/{id}
    update: async (id: number, data: UpdatePokemonDto): Promise<void> => {
        // Endpoint: http://localhost:3000/v2/pokemones/{id}
        // NOTA: Si el backend usara PUT, cambiar api.patch por api.put
        await api.patch(`/v2/pokemones/${id}`, data);
    }
};