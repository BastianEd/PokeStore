import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
// Se asume que ahora el archivo products exporta Pokemon
import type { Pokemon } from "~/data/products"; 

// Se renombra la interfaz interna para que coincida con el tema Pokémon
export interface CartItem extends Pokemon {
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    // Se cambia el tipo de dato esperado
    addToCart: (pokemon: Pokemon) => void; 
    removeFromCart: (pokedexId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadInitialCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem("cart");
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadInitialCart);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    // Se actualiza el parámetro
    const addToCart = (pokemon: Pokemon) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.pokedexId === pokemon.pokedexId);
            if (existing) {
                return prev.map((i) =>
                    i.pokedexId === pokemon.pokedexId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }
            return [...prev, { ...pokemon, quantity: 1 }];
        });
    };

    const removeFromCart = (pokedexId: number) => {
        setItems((prev) => prev.filter((i) => i.pokedexId !== pokedexId));
    };

    const clearCart = () => setItems([]);

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

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return ctx;
}