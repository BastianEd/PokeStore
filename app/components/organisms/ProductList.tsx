import type { Route } from "./+types/productos";
import { PRODUCTOS } from "~/data/products";
import { ProductCard } from "~/components/molecules/ProductCard";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Productos - Pastelería Mil Sabores" },
    ];
}

export default function Productos() {
    return (
        <section id="productos" className="section active">
            <div className="container">
                <h2 className="section-title">Nuestros Productos</h2>

                <div className="product-controls">
                    <input type="text"
                           id="product-search"
                           className="product-search"
                           placeholder="🔍 Buscar productos..."/>
                </div>

                <div className="filters">
                    <button className="filter-btn active" data-category="all">Todos</button>
                    <button className="filter-btn" data-category="Tortas Cuadradas">Tortas Cuadradas</button>
                    <button className="filter-btn" data-category="Tortas Circulares">Tortas Circulares</button>
                    <button className="filter-btn" data-category="Postres Individuales">Postres</button>
                    <button className="filter-btn" data-category="Productos Sin Azúcar">Sin Azúcar</button>
                    <button className="filter-btn" data-category="Pastelería Tradicional">Tradicional</button>
                    <button className="filter-btn" data-category="Productos Sin Gluten">Sin Gluten</button>
                    <button className="filter-btn" data-category="Productos Vegana">Vegana</button>
                    <button className="filter-btn" data-category="Tortas Especiales">Especiales</button>
                </div>

                <div className="products-grid" id="products-grid">
                    {PRODUCTOS.map(producto => (
                        <ProductCard key={producto.codigo} producto={producto} />
                    ))}
                </div>
            </div>
        </section>
    );
}