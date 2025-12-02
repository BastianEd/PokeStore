/**
 * @interface Pokemon
 * @description Define la estructura de datos para un Pokémon dentro de la aplicación.
 * Este contrato de datos es fundamental para la consistencia en el manejo de productos.
 *
 * @property {number} pokedexId - El número de identificación único en la Pokédex Nacional.
 * @property {string} nombre - El nombre del Pokémon.
 * @property {string} tipoPrincipal - El tipo elemental primario del Pokémon (ej. "Fuego", "Agua").
 * @property {number} precio - El costo del Pokémon en la moneda de la tienda (CLP).
 * @property {string} descripcion - Una breve descripción del Pokémon, sus características o historia.
 * @property {string} imagen - La URL a una imagen representativa del Pokémon.
 * @property {boolean} [destacado] - Propiedad opcional para marcar un Pokémon como producto destacado en la tienda.
 */
export interface Pokemon {
    pokedexId: number;
    nombre: string;
    tipoPrincipal: string;
    precio: number;
    descripcion: string;
    imagen: string;
    destacado?: boolean;
}

/**
 * @description Array que contiene el catálogo estático de Pokémon disponibles en la tienda.
 * En una aplicación de producción, estos datos provendrían de una API o una base de datos.
 * Cada objeto en el array debe cumplir con la interfaz `Pokemon`.
 * @type {Pokemon[]}
 */
export const POKEMONS: Pokemon[] = [
    {
        pokedexId: 4,
        nombre: "Charmander",
        tipoPrincipal: "Fuego",
        precio: 50000,
        descripcion: "Un Pokémon tipo Fuego, ideal para entrenadores principiantes. Su llama en la cola indica su salud.",
        imagen: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/004.png",
        destacado: true
    },
    {
        pokedexId: 25,
        nombre: "Pikachu",
        tipoPrincipal: "Eléctrico",
        precio: 75000,
        descripcion: "La mascota de la franquicia. Un pequeño roedor eléctrico, capaz de generar fuertes descargas.",
        imagen: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/025.png",
        destacado: true
    },
    {
        pokedexId: 6,
        nombre: "Charizard",
        tipoPrincipal: "Fuego",
        precio: 95000,
        descripcion: "Forma final de Charmander. Un dragón que escupe fuego con gran poder destructivo. Solo para entrenadores avanzados.",
        imagen: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/006.png",
        destacado: true
    },
];

/**
 * @description Objeto de configuración que contiene información de branding y metadatos de la empresa.
 * Centraliza los datos de la marca para facilitar su mantenimiento y consistencia en la UI.
 * @property {string} nombre - El nombre comercial de la tienda.
 * @property {string} eslogan - El lema o eslogan de la marca.
 * @property {string} aniversario - Dato conmemorativo, usado en campañas o UI.
 * @property {string} mision - La declaración de la misión de la empresa.
 * @property {string} vision - La declaración de la visión de la empresa.
 */
export const POKE_TRADING_CO = {
    nombre: "Pokémon Trading Co.",
    eslogan: "¡Atrápalos, entrénalos y véndelos!",
    aniversario: "25",
    mision: "Proporcionar a los entrenadores los mejores Pokémon al mejor precio, asegurando que cada criatura esté sana y lista para la batalla.",
    vision: "Convertirnos en el mercado Pokémon online líder en la región de Kanto y más allá, siendo el punto de encuentro de entrenadores y coleccionistas.",
};

/**
 * @description Array que define los tipos elementales de Pokémon disponibles en la aplicación.
 * Utilizado para la categorización, filtros de búsqueda y validación de datos.
 * @type {string[]}
 */
export const TIPOS = [
    "Fuego",
    "Agua",
    "Planta",
    "Eléctrico",
    "Veneno",
    "Normal",
    "Volador",
    "Hada",
    "Lucha",
    "Psíquico",
    "Tierra",
    "Roca",
    "Hielo",
    "Fantasma",
    "Dragón",
    "Acero"
];

/**
 * @description Alias para el array `TIPOS`. Se utiliza para mantener una semántica consistente
 * en contextos donde el término "categoría" es más apropiado que "tipo", como en filtros de UI.
 * @type {string[]}
 */
export const CATEGORIAS: string[] = TIPOS;