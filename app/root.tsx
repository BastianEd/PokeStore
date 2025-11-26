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
import { useState } from "react"; 

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
    const { usuarioActual, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const handleToggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };
    
    const handleNavLinkClick = () => {
        setIsMenuOpen(false);
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
                                    src="app/assets/img/pokestore_logo.png" 
                                    alt="Pokeball Logo" 
                                    className="logo-image" 
                                />
                                <h1 className="logo">PokeStore</h1>
                            </div>
                            <span className="tagline">¡El Mercado Pokémon más grande!</span>
                        </div>

                        {/* 2. SECCIÓN CENTRAL: BARRA DE BÚSQUEDA */}
                        <div className="product-controls">
                            <input
                                type="text"
                                className="product-search"
                                placeholder="Buscar Charizard, Pokeballs, Guías..."
                            />
                        </div>


                        {/* 3. SECCIÓN DERECHA: ACCIONES (AUTH y CARRITO) */}
                        <div className="nav-actions">
                            {usuarioActual ? (
                                <>
                                    <NavLink 
                                        to="/perfil" 
                                        className="profile-pill" 
                                        title="Ver perfil"
                                        onClick={handleNavLinkClick}
                                    >
                                        <i className="fas fa-user" />
                                        <span className="profile-name">{usuarioActual.nombre || usuarioActual.email}</span>
                                    </NavLink>
                                    <button type="button" className="btn-link" onClick={logout} style={{ marginRight: "0.75rem" }}>Cerrar sesión</button>
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