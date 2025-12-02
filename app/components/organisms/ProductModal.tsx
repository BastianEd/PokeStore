import type { FC } from "react";
import type { Pokemon } from "~/data/products";
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";

/**
 * @interface Props
 * @description Define las propiedades para el componente `ProductModal`.
 * @property {Pokemon | null} pokemon - El objeto Pokémon a mostrar en el modal. Si es `null`, el modal no se renderiza.
 * @property {boolean} isOpen - Controla la visibilidad del modal. `true` para mostrar, `false` para ocultar.
 * @property {() => void} onClose - Función callback que se invoca cuando el usuario intenta cerrar el modal.
 */
interface Props {
    pokemon: Pokemon | null; // Renombrado de prop de product a pokemon
    isOpen: boolean;
    onClose: () => void;
}

/**
 * @description Componente que renderiza un modal con la vista detallada de un Pokémon.
 *
 * Este "organismo" presenta una vista completa de un Pokémon, incluyendo su imagen, tipo,
 * descripción detallada y precio. Es un componente controlado, cuya visibilidad se gestiona
 * externamente a través de las props `isOpen` and `onClose`.
 *
 * Permite al usuario "capturar" el Pokémon (agregarlo al carrito) y utiliza los contextos
 * `useCart` y `useNotification` para ejecutar esta acción y proporcionar feedback.
 *
 * @param {Props} props - Las propiedades que controlan el estado y el contenido del modal.
 * @returns {React.ReactElement | null} El modal del producto o `null` si no está abierto o no hay Pokémon seleccionado.
 */
export const ProductModal: FC<Props> = ({ pokemon, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { showNotification } = useNotification();

    if (!isOpen || !pokemon) return null;

    /**
     * @description Maneja la adición del Pokémon al carrito de compras.
     * Invoca la función `addToCart` del contexto del carrito y luego dispara una notificación
     * para confirmar al usuario que la acción fue exitosa.
     */
    const handleAddToCart = () => {
        addToCart(pokemon as any); 
        showNotification(`¡${pokemon.nombre} capturado y listo para el combate! ⚡️`);
    };

    /**
     * @description Formatea un valor numérico a una cadena de texto en formato de moneda chilena (CLP).
     * @param {number} precio - El precio a formatear.
     * @returns {string} El precio formateado como una cadena de texto con el símbolo de la moneda.
     */
    const formatearPrecio = (precio: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(precio);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <i className="fas fa-times" />
                </button>

                <div className="modal-image-section">
                    <img 
                        src={pokemon.imagen} 
                        alt={pokemon.nombre} 
                        className="modal-product-image" 
                    />
                </div>

                <div className="modal-info-section">
                    <span className="modal-category">TIPO: {pokemon.tipoPrincipal}</span>
                    <h2 className="modal-title">{pokemon.nombre}</h2>
                    
                    <p className="modal-description">
                        {pokemon.descripcion}
                    </p>

                    <div className="modal-price">
                        {formatearPrecio(pokemon.precio)}
                    </div>
                    <p>Precio por unidad</p>

                    <button 
                        className="btn-primary modal-add-btn"
                        onClick={handleAddToCart}
                    >
                        <i className="fas fa-hand-rock" /> Capturar Pokémon
                    </button>

                    <div className="modal-footer-code">
                        Pokédex ID: #{pokemon.pokedexId}
                    </div>
                </div>
            </div>
        </div>
    );
};