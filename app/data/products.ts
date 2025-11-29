export interface Pokemon {
    pokedexId: number;
    nombre: string;
    tipoPrincipal: string;
    precio: number;
    descripcion: string;
    imagen: string;
    destacado?: boolean;
}

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

export const POKE_TRADING_CO = {
    nombre: "Pokémon Trading Co.",
    eslogan: "¡Atrápalos, entrénalos y véndelos!",
    aniversario: "25",
    mision: "Proporcionar a los entrenadores los mejores Pokémon al mejor precio, asegurando que cada criatura esté sana y lista para la batalla.",
    vision: "Convertirnos en el mercado Pokémon online líder en la región de Kanto y más allá, siendo el punto de encuentro de entrenadores y coleccionistas.",
};

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

export const CATEGORIAS: string[] = TIPOS;