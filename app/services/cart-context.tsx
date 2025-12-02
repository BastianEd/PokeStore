import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Pokemon } from "~/data/products"; 

/**
 * @interface CartItem
 * @description Extiende la interfaz `Pokemon` para incluir la cantidad de un ítem específico en el carrito.
 * @property {number} quantity - El número de unidades de un Pokémon específico en el carrito.
 */
export interface CartItem extends Pokemon {
    quantity: number;
}

/**
 * @interface CartContextValue
 * @description Define el valor completo que provee el `CartContext`, incluyendo el estado del carrito y las funciones para manipularlo.
 * @property {CartItem[]} items - Array de los ítems actualmente en el carrito.
 * @property {number} totalItems - La cantidad total de ítems en el carrito (sumando las cantidades de cada `CartItem`).
 * @property {number} totalPrice - El precio total de todos los ítems en el carrito.
 * @property {(pokemon: Pokemon) => void} addToCart - Función para agregar un Pokémon al carrito.
 * @property {(pokedexId: number) => void} removeFromCart - Función para eliminar un Pokémon del carrito por su ID.
 * @property {() => void} clearCart - Función para vaciar completamente el carrito.
 */
interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (pokemon: Pokemon) => void; 
    removeFromCart: (pokedexId: number) => void;
    clearCart: () => void;
}

// Creación del contexto de React para el carrito.
const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * @description Carga el estado inicial del carrito desde `localStorage`.
 * Esta función se ejecuta de forma segura solo en el lado del cliente. Si no hay datos guardados
 * o si ocurre un error durante el parseo, devuelve un array vacío.
 * @returns {CartItem[]} El estado inicial del carrito.
 */
function loadInitialCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem("cart");
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

/**
 * @description Proveedor de contexto que encapsula la lógica y el estado del carrito de compras.
 * Utiliza `localStorage` para persistir el estado del carrito entre sesiones del navegador.
 * @param {{ children: ReactNode }} props - Los componentes hijos que tendrán acceso a este contexto.
 */
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadInitialCart);

    // Efecto que se ejecuta cada vez que el estado `items` cambia.
    // Se encarga de sincronizar y persistir el estado actual del carrito en localStorage.
    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    /**
     * @description Agrega un Pokémon al carrito.
     * Si el Pokémon ya existe en el carrito, incrementa su cantidad en 1.
     * Si es un Pokémon nuevo, lo agrega al carrito con una cantidad inicial de 1.
     * @param {Pokemon} pokemon - El objeto Pokémon a agregar.
     */
    const addToCart = (pokemon: Pokemon) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.pokedexId === pokemon.pokedexId);
            if (existing) {
                // Si existe, mapeamos y actualizamos solo el ítem correspondiente.
                return prev.map((i) =>
                    i.pokedexId === pokemon.pokedexId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }
            // Si no existe, lo agregamos al final del array.
            return [...prev, { ...pokemon, quantity: 1 }];
        });
    };

    /**
     * @description Elimina completamente un ítem del carrito, sin importar su cantidad.
     * @param {number} pokedexId - El ID del Pokémon a eliminar.
     */
    const removeFromCart = (pokedexId: number) => {
        setItems((prev) => prev.filter((i) => i.pokedexId !== pokedexId));
    };

    /**
     * @description Vacía todos los ítems del carrito.
     */
    const clearCart = () => setItems([]);

    // Propiedades computadas que se derivan del estado `items`.
    // Se calculan en cada render para asegurar que siempre estén actualizadas.
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce(
        (sum, i) => sum + i.quantity * i.precio,
        0,
    );

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * @description Hook personalizado para consumir el `CartContext`.
 * Simplifica el acceso al contexto y asegura que se utilice dentro de un `CartProvider`.
 * @throws {Error} Lanza un error si se intenta usar fuera de un `CartProvider`.
 * @returns {CartContextValue} El valor completo del contexto del carrito.
 */
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return ctx;
}