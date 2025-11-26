// app/routes/cart.tsx
import type { Route } from "./+types/cart";
import { useCart } from "~/services/cart-context";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Carrito de Captura - Pokémon Trading Co." }];
}

export default function CartPage() {
    const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCart();

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
                        <article key={item.codigo} className="cart-item">
                            <img
                                src={item.imagen}
                                alt={item.nombre}
                                className="cart-item-image"
                            />

                            <div className="cart-item-info">
                                <h3>{item.nombre}</h3>
                                {/* Se asume que item ahora tiene 'tipoPrincipal' */}
                                <p>Tipo: {item.tipoPrincipal}</p> 
                                <p>Cantidad (Pokeballs): {item.quantity}</p>
                                <p>Precio unidad: ${item.precio}</p>
                                <p>Subtotal: ${item.precio * item.quantity}</p>

                                <button
                                    className="btn-secondary"
                                    onClick={() => removeFromCart(item.codigo)}
                                >
                                    Liberar Pokémon
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="cart-summary">
                    <p>Total Pokémon en el Equipo: {totalItems}</p>
                    <p>Total a pagar: ${totalPrice}</p>
                    <button className="btn-primary" onClick={clearCart}>
                        Liberar Equipo
                    </button>
                </div>
            </div>
        </section>
    );
}