import type { FC } from "react";
// Se asume que app/data/products.ts ha sido actualizado con la interfaz Pokemon
import type { Pokemon } from "~/data/products"; 
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";

interface Props {
    pokemon: Pokemon; // Renombrado de prop de product a pokemon
    onView: (pokemon: Pokemon) => void; // Renombrado de parámetro
}

export const ProductCard: FC<Props> = ({ pokemon, onView }) => {
    const { addToCart } = useCart();
    const { showNotification } = useNotification();

    const handleAddToCart = () => {
        // Se asume que addToCart es compatible con el nuevo tipo Pokemon
        addToCart(pokemon as any); 
        showNotification(`¡${pokemon.nombre} capturado y agregado al carrito! ⚡️`);
    };

    const formatearPrecio = (precio: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(precio);
    };

    return (
        <article className="product-card">
            <div className="product-image-header">
                {/* Mostrar ID de Pokédex y Tipo Principal */}
                <span className="category-badge">#{pokemon.pokedexId} - {pokemon.tipoPrincipal}</span>
                <img 
                    src={pokemon.imagen} 
                    alt={`Ilustración de ${pokemon.nombre}`} 
                    className="product-image" 
                />
            </div>

            <div className="product-content">
                <h3 className="product-title">{pokemon.nombre}</h3>
                {/* Muestra una descripción corta */}
                <p className="product-description">{pokemon.descripcion.substring(0, 50)}...</p>
                <div className="product-price-row">{formatearPrecio(pokemon.precio)}</div>

                <div className="product-actions">
                    <button className="btn-add-cart" onClick={handleAddToCart}>
                        <i className="fas fa-hand-rock" /> Capturar
                    </button>
                    
                    <button className="btn-view-product" title="Ver ficha Pokémon" onClick={() => onView(pokemon)}>
                        <i className="fas fa-eye" />
                    </button>
                </div>
            </div>
        </article>
    );
};