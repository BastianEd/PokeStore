import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    Link,
    NavLink,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { CartProvider } from "~/services/cart-context";
import { AuthProvider, useAuth } from "~/services/auth-context";
import { NotificationProvider } from "~/services/notification-context";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { FaSearch } from "react-icons/fa";
import { POKEMONS, type Pokemon } from "~/data/products";
import { ProductService } from "~/services/product.service";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Luckiest+Guy&display=swap",
    },
    {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
    },
];

function Shell({ children }: { children: React.ReactNode }) {
    // 1. AÑADIDO: Extraemos isAdmin del contexto
    const { usuarioActual, logout, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleNavLinkClick = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    const handleOverlayClick = () => {
        setIsMenuOpen(false);
    };

    return (
        // Contenedor principal con layout de columna para mantener el footer abajo
        <div id="app-wrapper" className={isMenuOpen ? "menu-open" : ""} onClick={(e) => {
            // Cerrar menú si se hace click en el overlay
            if (e.target === e.currentTarget && isMenuOpen) {
                handleOverlayClick();
            }
        }}>
            <header className="header">
                <nav className="navbar">
                    <div className="container">
                        {/* 1. SECCIÓN IZQUIERDA: MENÚ Y LOGO */}
                        <div className="nav-brand">
                            {/* Botón de Menú (Hamburguesa) - Agregamos la lógica y la clase 'active' */}
                            <button
                                className={"nav-toggle" + (isMenuOpen ? " active" : "")}
                                title="Menú"
                                onClick={handleToggleMenu}
                            >
                                <span /><span /><span />
                            </button>

                            {/* Logo */}
                            <div className="logo-content">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png"
                                    alt="Pokeball Logo"
                                    className="logo-image"
                                />
                                <h1 className="logo">PokeStore</h1>
                            </div>
                            <span className="tagline">¡El Mercado Pokémon más grande!</span>
                        </div>

                        {/* 2. SECCIÓN CENTRAL: BARRA DE BÚSQUEDA */}
                        <div className="product-controls">
                            <span className="search-icon" aria-hidden="true"><FaSearch /></span>

                            <input
                                type="text"
                                className="product-search"
                                placeholder="Buscar Charizard, Pokeballs, Guías..."
                                aria-label="Buscar"
                                value={searchText}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchText(val);
                                    setShowSuggestions(val.trim().length > 0);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setShowSuggestions(false);
                                    }
                                }}
                            />
                            {searchText && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchText(''); setShowSuggestions(false); }}
                                    className="clear-search-btn"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: '#e2e8f0',
                                        border: 'none',
                                        padding: '2px 6px',
                                        borderRadius: 6,
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                        color: '#334155'
                                    }}
                                    title="Limpiar búsqueda"
                                >
                                    ×
                                </button>
                            )}

                            {showSuggestions && (
                                <SearchSuggestions searchText={searchText} onClose={() => setShowSuggestions(false)} />
                            )}
                        </div>


                        {/* 3. SECCIÓN DERECHA: ACCIONES (AUTH y CARRITO) */}
                        <div className="nav-actions">
                            {usuarioActual ? (
                                <>
                                    {/* 2. AÑADIDO: Botón Dashboard para Admins (Escritorio) */}
                                    {isAdmin && (
                                        <NavLink
                                            to="/admin/dashboard"
                                            className="profile-pill admin-pill"
                                            style={{
                                                backgroundColor: '#2c3e50',
                                                color: 'white',
                                                borderColor: '#2c3e50',
                                                marginRight: '8px'
                                            }}
                                            title="Panel de Administración"
                                        >
                                            <i className="fas fa-tools" />
                                            <span className="profile-name" style={{marginLeft: '5px'}}>Admin</span>
                                        </NavLink>
                                    )}

                                    <div className="profile-menu-wrapper">
                                        <button
                                            type="button"
                                            className={"profile-pill" + (isProfileMenuOpen ? " active" : "")}
                                            title="Menú de perfil"
                                            onClick={() => setIsProfileMenuOpen((v) => !v)}
                                        >
                                            <i className="fas fa-user" />
                                            <span className="profile-name">{usuarioActual.nombre || usuarioActual.email}</span>
                                            <i className="fas fa-chevron-down" style={{ marginLeft: "6px", fontSize: "0.85rem" }} />
                                        </button>
                                        {isProfileMenuOpen && (
                                            <div className="profile-dropdown">
                                                <NavLink to="/perfil" className="profile-dropdown-item" onClick={handleNavLinkClick}>
                                                    <i className="fas fa-id-card" /> Mi Perfil
                                                </NavLink>
                                                <button type="button" className="profile-dropdown-item" onClick={() => { setIsProfileMenuOpen(false); logout(); }}>
                                                    <i className="fas fa-sign-out-alt" /> Cerrar sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="user-info" style={{ display: "none" }} />
                            )}

                            <NavLink to="/cart" className="cart-btn" id="cart-btn" title="Ver carrito">
                                <i className="fas fa-shopping-cart" />
                                <span className="cart-count" style={{ display: "none" }}>0</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>

                {/* MENÚ DE NAVEGACIÓN PRINCIPAL (TOGGLEABLE) */}
                <ul className={"nav-menu" + (isMenuOpen ? " active" : "")} id="nav-menu">
                    <li><NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Inicio</NavLink></li>
                    <li><NavLink to="/productos" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Pokédex</NavLink></li>
                    <li><NavLink to="/contacto" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Centro Pokémon</NavLink></li>

                    {/* 3. AÑADIDO: Enlace Admin en menú móvil */}
                    {isAdmin && (
                        <li><NavLink to="/admin/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Panel Admin</NavLink></li>
                    )}

                    {!usuarioActual && (
                        <>
                            <li className="menu-divider"></li>
                            <li><NavLink to="/registro" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Registro</NavLink></li>
                            <li><NavLink to="/login" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={handleNavLinkClick}>Iniciar Sesión</NavLink></li>
                        </>
                    )}
                </ul>
            </header>
            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>PokeStore</h4>
                            <p>La plataforma más confiable desde 1999 para adquirir, vender e intercambiar Pokémon de todas las regiones.</p>
                            <div className="social-links">
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" /></a>
                                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-x" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 PokeStore. Todos los derechos reservados. | ¡Gotta catch 'em all!</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
        <AuthProvider>
            <NotificationProvider>
                <CartProvider>
                    <Shell>{children}</Shell>
                </CartProvider>
            </NotificationProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return null;
}

function SearchSuggestions({ searchText, onClose }: { searchText: string; onClose: () => void }) {
    const term = searchText.trim().toLowerCase();
    const [allProducts, setAllProducts] = useState<Pokemon[]>(POKEMONS); // Fallback inicial
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carga perezosa de todos los Pokémon desde backend una sola vez
    useEffect(() => {
        if (loaded) return; // evitar múltiples fetch
        let mounted = true;
        ProductService.getAll()
            .then(data => {
                if (!mounted) return;
                // Mezclar estáticos (para imágenes/tipos especiales) si se desea evitar duplicados
                const mergedMap = new Map<number, Pokemon>();
                for (const p of data) mergedMap.set(p.pokedexId, p);
                for (const p of POKEMONS) {
                    if (!mergedMap.has(p.pokedexId)) mergedMap.set(p.pokedexId, p);
                }
                setAllProducts(Array.from(mergedMap.values()));
                setLoaded(true);
            })
            .catch(e => {
                if (!mounted) return;
                setError("No se pudo cargar catálogo completo. Mostrando lista parcial.");
                setLoaded(true);
            });
        return () => { mounted = false; };
    }, [loaded]);

    const results = useMemo(() => {
        if (!term) return [] as Pokemon[];
        return allProducts
            .filter(p => p.nombre.toLowerCase().includes(term))
            .slice(0, 6); // ampliar a 6 resultados
    }, [term, allProducts]);

    if (results.length === 0) return null;

    return (
        <div className="search-suggestions" role="listbox">
            {error && (
                <div className="suggestion-error" style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#b91c1c' }}>
                    {error}
                </div>
            )}
            {results.map((p) => (
                <Link
                    key={p.pokedexId}
                    to={`/productos?q=${encodeURIComponent(p.nombre)}&exact=1#${p.pokedexId}`}
                    className="suggestion-card"
                    role="option"
                    onClick={onClose}
                >
                    <img src={p.imagen} alt={p.nombre} className="suggestion-image img-no-white" />
                    <div className="suggestion-info">
                        <strong className="suggestion-name">{p.nombre}</strong>
                        <span className="suggestion-type">{p.tipoPrincipal}</span>
                    </div>
                </Link>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '4px 8px' }}>
                <Link
                    to="/productos"
                    onClick={onClose}
                    style={{ fontSize: '0.65rem', color: '#0369a1', textDecoration: 'underline' }}
                >
                    Ver todos
                </Link>
                <button
                    type="button"
                    onClick={() => { onClose(); /* No navegamos, solo cerramos */ }}
                    style={{ fontSize: '0.65rem', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                    Cerrar
                </button>
            </div>
            {!loaded && (
                <div style={{ padding: '6px 8px', fontSize: '0.65rem', color: '#555' }}>Cargando catálogo completo...</div>
            )}
        </div>
    );
}