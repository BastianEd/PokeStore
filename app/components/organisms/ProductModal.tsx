import type { FC } from "react";
// Se asume que app/data/products.ts ha sido actualizado con la interfaz Pokemon
import type { Pokemon } from "~/data/products";
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";

interface Props {
    pokemon: Pokemon | null; // Renombrado de prop de product a pokemon
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal: FC<Props> = ({ pokemon, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { showNotification } = useNotification();

    if (!isOpen || !pokemon) return null;

    const handleAddToCart = () => {
        addToCart(pokemon as any); 
        showNotification(`¡${pokemon.nombre} capturado y listo para el combate! ⚡️`);
    };

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