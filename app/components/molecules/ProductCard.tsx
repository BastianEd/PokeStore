import type { FC } from "react";
import type { Pokemon } from "~/data/products"; 
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";

/**
 * @interface Props
 * @description Define las propiedades para el componente `ProductCard`.
 * @property {Pokemon} pokemon - El objeto Pokémon que se mostrará en la tarjeta.
 * @property {(pokemon: Pokemon) => void} onView - Función callback que se ejecuta cuando el usuario hace clic en el botón "Ver ficha".
 */
interface Props {
    pokemon: Pokemon; // Renombrado de prop de product a pokemon
    onView: (pokemon: Pokemon) => void; // Renombrado de parámetro
}

/**
 * @description Componente que renderiza una tarjeta de producto para un Pokémon específico.
 *
 * Esta tarjeta muestra información clave del Pokémon como su imagen, nombre, ID de Pokédex,
 * tipo principal, una breve descripción y precio. Proporciona acciones para "capturar"
 * (agregar al carrito) y para ver una ficha más detallada del Pokémon.
 *
 * Utiliza `useCart` para la lógica de agregar al carrito y `useNotification` para
 * proporcionar feedback visual al usuario tras una captura exitosa.
 *
 * @param {Props} props - Las propiedades del componente, incluyendo el `pokemon` a mostrar y la función `onView`.
 * @returns {React.ReactElement} Una tarjeta de producto interactiva para un Pokémon.
 */
export const ProductCard: FC<Props> = ({ pokemon, onView }) => {
    const { addToCart } = useCart();
    const { showNotification } = useNotification();

    /**
     * @description Maneja la acción de "capturar" un Pokémon.
     * Agrega el Pokémon actual al carrito de compras y muestra una notificación
     * de éxito para confirmar la acción al usuario.
     */
    const handleAddToCart = () => {
        addToCart(pokemon as any); 
        showNotification(`¡${pokemon.nombre} capturado y agregado al carrito! ⚡️`);
    };

    /**
     * @description Formatea un valor numérico a una cadena de texto en formato de moneda chilena (CLP).
     * @param {number} precio - El precio a formatear.
     * @returns {string} El precio formateado como moneda.
     */
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