import type { Route } from "./+types/home";
import { useState } from "react";
// Importar la data Pokémon
import { POKEMONS, POKE_TRADING_CO, type Pokemon } from "~/data/products"; 
import { ProductCard } from "~/components/molecules/ProductCard";
import { ProductModal } from "~/components/organisms/ProductModal";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        {
            title: "Pokémon Trading Co. - ¡Atrápalos, Entrénalos y Véndelos!",
        },
        {
            name: "description",
            content:
                "Pokémon Trading Co. - La mejor plataforma para adquirir, entrenar y vender Pokémon.",
        },
    ];
}

export default function Home() {
    // Usar Pokemons Destacados
    const pokemonsDestacados = POKEMONS.filter((p) => p.destacado).slice(0, 4);

    // LÓGICA DEL MODAL
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

    return (
        <section id="home" className="section active">
            <div className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h2 className="hero-title">¡Comienza tu aventura hoy!</h2>
                            <p className="hero-subtitle">
                                {POKE_TRADING_CO.eslogan}
                            </p>

                            <div className="hero-features">
                                <div className="feature">
                                    <i className="fas fa-flask" /> 
                                    <span>Pokémon con estadísticas garantizadas</span>
                                </div>
                                <div className="feature">
                                    <i className="fas fa-bolt" /> 
                                    <span>Tipos Raros y Legendarios disponibles</span>
                                </div>
                                <div className="feature">
                                    <i className="fas fa-warehouse" /> 
                                    <span>Envíos seguros a la región de Kanto y Johto</span>
                                </div>
                                <div className="feature">
                                    <i className="fas fa-heart" />
                                    <span>¡El mejor trato para entrenadores y coleccionistas!</span>
                                </div>
                            </div>

                            <Link to="/productos" className="btn-primary hero-btn">
                                <i className="fas fa-store" /> Ver Pokédex
                            </Link>
                        </div>

                        {/* El contenedor .anniversary-badge y su contenido ahora son gestionados por el CSS para la estética de Pokeball. */}
                        <div className="hero-image">
                            <div className="anniversary-badge">
                                <div className="anniversary-number">{POKE_TRADING_CO.aniversario}</div>
                                <div className="anniversary-text">años en el mercado</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <h3 className="section-title">Pokémon de la Semana</h3>
                <div className="products-grid" id="featured-products">
                    {pokemonsDestacados.map((pokemon) => (
                        <ProductCard 
                            key={pokemon.pokedexId} 
                            pokemon={pokemon} 
                            onView={handleViewPokemon}
                        />
                    ))}
                </div>
            </div>

            <div className="company-info">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>Nuestra Misión</h4>
                            <p>{POKE_TRADING_CO.mision}</p>
                        </div>
                        <div className="info-card">
                            <h4>Nuestra Visión</h4>
                            <p>{POKE_TRADING_CO.vision}</p>
                        </div>
                        <div className="info-card">
                            <h4>La Historia de la Compañía</h4>
                            <p>
                                Fundada al inicio de la Liga Pokémon, hemos evolucionado de un pequeño centro de intercambio a la tienda de confianza de los Grandes Maestros.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ProductModal 
                isOpen={modalOpen} 
                onClose={handleCloseModal} 
                pokemon={selectedPokemon} 
            />
        </section>
    );
}