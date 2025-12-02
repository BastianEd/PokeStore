import type { Route } from "./+types/home";
import { useState } from "react";
import { POKEMONS, POKE_TRADING_CO, type Pokemon } from "~/data/products"; 
import { ProductCard } from "~/components/molecules/ProductCard";
import { ProductModal } from "~/components/organisms/ProductModal";
import { Link } from "react-router";

/**
 * @description Genera los metadatos para la página de inicio.
 * Esta función es crucial para el SEO, estableciendo el título y la descripción
 * que aparecerán en los resultados de búsqueda y en la pestaña del navegador.
 *
 * @param {Route.MetaArgs} args - Argumentos proporcionados por el enrutador.
 * @returns {Array<Object>} Un array de objetos de metadatos.
 */
export function meta({}: Route.MetaArgs) {
    return [
        {
            title: "PokeStore - ¡Atrápalos y Entrénalos!",
        },
        {
            name: "description",
            content:
                "PokeStore - La mejor plataforma para adquirir, entrenar Pokemon.",
        },
    ];
}

/**
 * @description Componente que renderiza la página de inicio o "landing page" de la aplicación.
 *
 * Esta página sirve como la principal puerta de entrada para los usuarios. Sus responsabilidades son:
 * - **Presentar la Propuesta de Valor**: A través de una sección "hero" que destaca las características clave de la tienda.
 * - **Mostrar Productos Destacados**: Filtra y muestra una selección de "Pokémon de la Semana" para atraer el interés del usuario.
 * - **Gestionar la Interacción del Modal**: Controla la lógica para abrir un modal con la vista detallada de un Pokémon
 *   cuando el usuario interactúa con una `ProductCard`. Utiliza el estado local para manejar la visibilidad (`modalOpen`)
 *   y el contenido (`selectedPokemon`) del modal.
 *
 * @returns {React.ReactElement} La página de inicio completa.
 */
export default function Home() {
    // Usar Pokemons Destacados
    const pokemonsDestacados = POKEMONS.filter((p) => p.destacado).slice(0, 4);

    // LÓGICA DEL MODAL
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    /**
     * @description Manejador para abrir el modal de vista de producto.
     * Esta función se pasa como prop `onView` a cada `ProductCard`.
     * @param {Pokemon} pokemon - El objeto Pokémon seleccionado por el usuario.
     */
    const handleViewPokemon = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
        setModalOpen(true);
    };

    /**
     * @description Manejador para cerrar el modal de vista de producto.
     * Restablece el estado para ocultar el modal y limpiar la selección.
     */
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

                        {/* Imagen Pokéball en el hero */}
                        <div className="hero-image">
                            <img
                                src={("https://i.ibb.co/6cB613zT/logo-hero-pokestore.webp")}
                                alt="Pokéball"
                                style={{
                                    maxWidth: "85%",
                                    maxHeight: "360px",
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))"
                                }}
                            />
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

            <ProductModal 
                isOpen={modalOpen} 
                onClose={handleCloseModal} 
                pokemon={selectedPokemon} 
            />
        </section>
    );
}