import type { Route } from "./+types/cart";
import { useCart } from "~/services/cart-context";
import { useNotification } from "~/services/notification-context";
import { useAuth } from "~/services/auth-context";
import { useState, useRef, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Carrito de Captura - Pokémon Trading Co." }];
}

export default function CartPage() {
    const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
    const { showNotification } = useNotification();
    const { agregarCompras } = useAuth();
    const [lastPurchase, setLastPurchase] = useState<any | null>(null);
    const [isReceiptLoading, setIsReceiptLoading] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Si no hay items y no hay una compra reciente ni estamos cargando la boleta, mostramos el estado vacío.
    // Permitimos renderizar cuando `isReceiptLoading` es true para que se vea el spinner.
    if (totalItems === 0 && !lastPurchase && !isReceiptLoading) {
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
                    <div className="button-row">
                        <button className="btn-secondary" onClick={clearCart}>
                            Liberar Equipo
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                const nueva = agregarCompras(
                                    items.map((i) => ({
                                        pokedexId: i.pokedexId,
                                        nombre: i.nombre,
                                        imagen: i.imagen,
                                        tipoPrincipal: i.tipoPrincipal,
                                        quantity: i.quantity,
                                        precio: i.precio,
                                    }))
                                );

                                showNotification("¡Compra realizada! Tus Pokémon ya son tuyos.");
                                clearCart();

                                if (nueva) {
                                    // Simular carga de boleta por 2 segundos
                                    setIsReceiptLoading(true);
                                    timeoutRef.current = window.setTimeout(() => {
                                        setLastPurchase(nueva);
                                        setIsReceiptLoading(false);
                                        timeoutRef.current = null;
                                    }, 2000);
                                }
                            }}
                        >
                            <FiShoppingCart style={{ marginRight: 8 }} /> Comprar
                        </button>
                    </div>
                </div>
                {isReceiptLoading && (
                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', zIndex: 1000 }}>
                        <style>{`
                            @keyframes pokeball-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                            .pokeball-wrap { width: 120px; display:flex; flex-direction:column; align-items:center; gap:12px }
                            .pokeball { width: 120px; height: 120px; border-radius: 50%; position: relative; overflow: hidden; box-sizing: border-box; border: 8px solid #000; animation: pokeball-spin 1.4s linear infinite; background: #fff }
                            .pokeball-top { position: absolute; top: 0; left: 0; right: 0; height: 50%; background: #d33; }
                            .pokeball-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 50%; background: #fff; }
                            .pokeball-band { position: absolute; left: 0; right: 0; top: 46%; height: 12px; background: #000; }
                            .pokeball-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: #fff; border: 6px solid #000; display:flex; align-items:center; justify-content:center; }
                            .pokeball-center-inner { width: 18px; height: 18px; border-radius: 50%; background: #000; }
                            .pokeball-text { font-weight: 700; color: #111; }
                            .pokeball-sub { color: #666; font-size: 0.9rem }
                        `}</style>

                        <div className="pokeball-wrap" aria-live="polite">
                            <div className="pokeball" role="img" aria-label="Cargando boleta">
                                <div className="pokeball-top" />
                                <div className="pokeball-bottom" />
                                <div className="pokeball-band" />
                                <div className="pokeball-center"><div className="pokeball-center-inner" /></div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="pokeball-text">Generando boleta...</div>
                                <div className="pokeball-sub">Esto puede tardar unos segundos</div>
                            </div>
                        </div>
                    </div>
                )}
                {lastPurchase && (
                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
                        <div style={{ width: 'min(820px, 95%)', maxHeight: '90vh', overflowY: 'auto', background: '#fff', padding: '1.25rem', borderRadius: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ margin: 0 }}>Boleta de Compra #{lastPurchase.id}</h3>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <strong style={{ color: '#333', alignSelf: 'center' }}>{new Date(lastPurchase.fecha).toLocaleString('es-CL')}</strong>
                                    <button className="btn-secondary" onClick={() => setLastPurchase(null)}>Cerrar</button>
                                </div>
                            </div>

                            <div>
                                {(lastPurchase.items || []).map((it: any) => (
                                    <div key={it.pokedexId} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <img src={it.imagen} alt={it.nombre} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700 }}>{it.nombre}</div>
                                            <div style={{ color: '#666' }}>{it.tipoPrincipal}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div>{it.quantity} × {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(it.precio)}</div>
                                            <div style={{ fontWeight: 700 }}>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format((it.precio ?? 0) * (it.quantity ?? 1))}</div>
                                        </div>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#666' }}>Total</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format((lastPurchase.items || []).reduce((s: number, it: any) => s + (it.precio ?? 0) * (it.quantity ?? 1), 0))}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}