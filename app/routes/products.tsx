import type { Route } from "./+types/products";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
// Ya no importamos POKEMONS estático, solo los tipos
import { TIPOS, type Pokemon } from "~/data/products";
import { ProductCard } from "~/components/molecules/ProductCard";
import { ProductModal } from "~/components/organisms/ProductModal";
import { ProductService } from "~/services/product.service"; // Importamos el servicio

export function meta({}: Route.MetaArgs) {
    return [{ title: "Pokédex de Venta - Pokémon Trading Co." }];
}

export default function Productos() {
    const [products, setProducts] = useState<Pokemon[]>([]); // Estado para los productos
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const location = useLocation();
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("all");

    // Estado para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    // EFECTO: Cargar productos desde el Backend al montar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await ProductService.getAll();
                setProducts(data);
            } catch (err) {
                console.error("Error cargando productos:", err);
                setError("No se pudieron cargar los Pokémon. Verifica que el servidor esté corriendo.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleViewPokemon = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPokemon(null);
    };

    // Lógica de filtrado (ahora usa el estado 'products' en vez de la constante POKEMONS)
    const pokemonsFiltrados = useMemo(() => {
        return products.filter((p) => {
            // 1. Manejo de Tipos (Soporte para múltiples tipos como "Fuego, Volador")
            // Convertimos la string de la BD en un array: "Fuego, Volador" -> ["fuego", "volador"]
            const tiposDelPokemon = (p.tipoPrincipal || "")
                .toLowerCase()
                .split(",")
                .map((t) => t.trim());

            const filtroSeleccionado = tipoSeleccionado.toLowerCase().trim();

            // Verificamos si la lista de tipos del pokemon INCLUYE la categoría seleccionada
            const matchTipo =
                tipoSeleccionado === "all" ||
                tiposDelPokemon.includes(filtroSeleccionado);

            // 2. Búsqueda por Texto (Nombre o ID)
            const term = search.trim().toLowerCase();
            const isExact = new URLSearchParams(location.search).get("exact") === "1";

            const matchSearch = isExact
                ? term === "" || p.nombre.toLowerCase() === term
                : term === "" ||
                p.nombre.toLowerCase().includes(term) ||
                p.pokedexId.toString().includes(term);

            return matchTipo && matchSearch;
        });
    }, [products, search, tipoSeleccionado, location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("q") || "";
        setSearch(q);
    }, [location.search]);

    if (loading) {
        return (
            <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
                <p>Cargando Pokédex desde el servidor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: "4rem", textAlign: "center", color: "red" }}>
                <p>{error}</p>
            </div>
        );
    }

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
                    {/* Nota: Idealmente los TIPOS también deberían venir del backend */}
                    {TIPOS.map((tipo) => (
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
                            pokemon={pokemon}
                            onView={handleViewPokemon}
                        />
                    ))}
                    {pokemonsFiltrados.length === 0 && (
                        <p className="empty-message">
                            No hay Pokémon disponibles que coincidan con tu búsqueda.
                        </p>
                    )}
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