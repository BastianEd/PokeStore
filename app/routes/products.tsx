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
            // 1. Normalización (limpieza) de datos para comparar
            // Convertimos todo a minúsculas para evitar errores de "Fuego" vs "fuego"
            const tipoPokemon = p.tipoPrincipal?.toLowerCase().trim() || "";
            const tipoFiltro = tipoSeleccionado.toLowerCase().trim();
            const terminoBusqueda = search.trim().toLowerCase();

            // 2. Lógica de coincidencia de TIPO
            const matchTipo =
                tipoSeleccionado === "all" ||
                tipoPokemon === tipoFiltro;

            // 3. Lógica de coincidencia de BÚSQUEDA (Nombre o ID)
            const isExact = new URLSearchParams(location.search).get("exact") === "1";

            // Permitimos buscar por nombre O por ID (pokedexId)
            const matchSearch = isExact
                ? terminoBusqueda === "" || p.nombre.toLowerCase() === terminoBusqueda
                : terminoBusqueda === "" ||
                p.nombre.toLowerCase().includes(terminoBusqueda) ||
                p.pokedexId.toString().includes(terminoBusqueda);

            return matchTipo && matchSearch;
        });
    }, [search, tipoSeleccionado, location.search, products]);

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