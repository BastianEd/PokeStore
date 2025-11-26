import type { Route } from "./+types/products";
import { useMemo, useState } from "react";
// Importar la nueva data: POKEMONS, TIPOS, Pokemon
import { POKEMONS, TIPOS, type Pokemon } from "~/data/products"; 
import { ProductCard } from "~/components/molecules/ProductCard"; 
import { ProductModal } from "~/components/organisms/ProductModal";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Pokédex de Venta - Pokémon Trading Co." }];
}

export default function Productos() {
    const [search, setSearch] = useState("");
    // Usar 'tipoSeleccionado' en lugar de 'categoriaSeleccionada'
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("all");
    
    // Estado para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    const handleViewPokemon = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPokemon(null);
    };

    // Lógica de filtrado actualizada
    const pokemonsFiltrados = useMemo(
        () =>
            POKEMONS.filter((p) => {
                const matchTipo =
                    tipoSeleccionado === "all" ||
                    p.tipoPrincipal === tipoSeleccionado; // Filtrar por tipoPrincipal

                const term = search.trim().toLowerCase();
                const matchSearch =
                    term === "" ||
                    p.nombre.toLowerCase().includes(term) ||
                    p.descripcion.toLowerCase().includes(term) ||
                    p.tipoPrincipal.toLowerCase().includes(term); 

                return matchTipo && matchSearch;
            }),
        [search, tipoSeleccionado],
    );

    return (
        <section id="productos" className="section active">
            <div className="container">
                <h2 className="section-title">Pokédex</h2>


                <div className="filters">
                    <button
                        className={"filter-btn" + (tipoSeleccionado === "all" ? " active" : "")}
                        onClick={() => setTipoSeleccionado("all")}
                    >
                        Todos
                    </button>
                    {TIPOS.map((tipo) => ( // Mapear por TIPOS
                        <button
                            key={tipo}
                            className={"filter-btn" + (tipoSeleccionado === tipo ? " active" : "")}
                            onClick={() => setTipoSeleccionado(tipo)}
                        >
                            {tipo}
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {pokemonsFiltrados.map((pokemon) => (
                        <ProductCard 
                            key={pokemon.pokedexId} 
                            pokemon={pokemon} // Pasar prop renombrada
                            onView={handleViewPokemon} // Pasar handler renombrado
                        />
                    ))}
                    {pokemonsFiltrados.length === 0 && (
                        <p className="empty-message">
                            No hay Pokémon disponibles que coincidan con tu búsqueda. ¡Intenta con otro filtro! 😔
                        </p>
                    )}
                </div>
            </div>

            <ProductModal 
                isOpen={modalOpen} 
                onClose={handleCloseModal} 
                pokemon={selectedPokemon} // Pasar prop renombrada
            />
        </section>
    );
}