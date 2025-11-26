// app/routes/cart.tsx
import type { Route } from "./+types/cart";
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Carrito de Captura - Pokémon Trading Co." }];
}

export default function CartPage() {
    const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
    const { showNotification } = useNotification();

    if (totalItems === 0) {
        return (
            <section id="carrito" className="section active">
                <div className="container">
                    <h2 className="section-title">Tu carrito de captura está vacío</h2>
                    <p>Agrega algunos Pokémon geniales a tu equipo desde la Pokédex ⚡️.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="carrito" className="section active">
            <div className="container">
                <h2 className="section-title">Pokémons en tu Equipo</h2>

                <div className="cart-grid">
                    {items.map((item) => (
                        <article key={item.pokedexId} className="cart-item">
                            <img
                                src={item.imagen}
                                alt={item.nombre}
                                className="cart-item-image"
                            />

                            <div className="cart-item-info">
                                <h3>{item.nombre}</h3>
                                {/* Se asume que item ahora tiene 'tipoPrincipal' */}
                                <p>Tipo: {item.tipoPrincipal}</p> 
                                <p>Cantidad: {item.quantity}</p>
                                <p>Precio unidad: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.precio)}</p>
                                <p>Subtotal: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.precio * item.quantity)}</p>

                                <button
                                    className="btn-secondary"
                                    onClick={() => removeFromCart(item.pokedexId)}
                                >
                                    Liberar Pokémon
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="cart-summary">
                    <p>Total Pokémon en el Equipo: {totalItems}</p>
                    <p>Total a pagar: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(totalPrice)}</p>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn-secondary" onClick={clearCart}>
                            Liberar Equipo
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                showNotification("¡Compra realizada! Tus Pokémon ya son tuyos.");
                                clearCart();
                            }}
                        >
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}