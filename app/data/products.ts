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
        imagen: "app/assets/img/Charmander.png",
        destacado: true
    },
    {
        pokedexId: 7,
        nombre: "Squirtle",
        tipoPrincipal: "Agua",
        precio: 52000,
        descripcion: "Un pequeño Pokémon tortuga tipo Agua. Lanza chorros de agua con gran precisión.",
        imagen: "app/assets/img/Squirtle.png",
    },
    {
        pokedexId: 25,
        nombre: "Pikachu",
        tipoPrincipal: "Eléctrico",
        precio: 75000,
        descripcion: "La mascota de la franquicia. Un pequeño roedor eléctrico, capaz de generar fuertes descargas.",
        imagen: "app/assets/img/Pikachu.png",
        destacado: true
    },
    {
        pokedexId: 1,
        nombre: "Bulbasaur",
        tipoPrincipal: "Planta",
        precio: 48000,
        descripcion: "Pokémon tipo Planta/Veneno. Lleva una semilla en su espalda que crece con él.",
        imagen: "app/assets/img/Bulbasaur.png",
        destacado: true
    },
    {
        pokedexId: 143,
        nombre: "Snorlax",
        tipoPrincipal: "Normal",
        precio: 60000,
        descripcion: "Un Pokémon muy grande que es más feliz cuando duerme. Su despertar requiere una Pokeflauta.",
        imagen: "app/assets/img/Snorlax.png",
    },
    {
        pokedexId: 6,
        nombre: "Charizard",
        tipoPrincipal: "Fuego",
        precio: 95000,
        descripcion: "Forma final de Charmander. Un dragón que escupe fuego con gran poder destructivo. Solo para entrenadores avanzados.",
        imagen: "app/assets/img/Charizard.png",
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

export const TIPOS: string[] = Array.from(
    new Set(POKEMONS.map((p) => p.tipoPrincipal)),
);

export const CATEGORIAS: string[] = TIPOS;