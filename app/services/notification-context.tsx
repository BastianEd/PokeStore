import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * @interface NotificationContextType
 * @description Define la forma del valor que se expone a través del `NotificationContext`.
 * @property {(message: string) => void} showNotification - Función para mostrar una notificación con un mensaje específico.
 */
interface NotificationContextType {
    showNotification: (message: string) => void;
}

// Creación del contexto de React. Se inicializa como `undefined` y se le proveerá un valor en `NotificationProvider`.
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * @description Proveedor de contexto que implementa un sistema de notificaciones global para la aplicación.
 *
 * Este componente se encarga de:
 * 1. Gestionar el estado de una notificación (mensaje y visibilidad).
 * 2. Exponer una única función `showNotification` para que cualquier componente hijo pueda disparar una notificación.
 * 3. Renderizar el componente visual de la notificación, que aparece y desaparece basado en el estado interno.
 *
 * @param {{ children: ReactNode }} props - Los componentes hijos que tendrán acceso a este contexto y sobre los cuales se mostrará la notificación.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    /**
     * @description Muestra una notificación en la pantalla.
     * La función está envuelta en `useCallback` para asegurar que su referencia no cambie en cada render,
     * optimizando el rendimiento en componentes hijos que puedan depender de ella.
     *
     * Al ser llamada, establece el mensaje, hace visible la notificación y programa un temporizador
     * para ocultarla automáticamente después de 3 segundos.
     *
     * @param {string} msg - El mensaje de texto que se mostrará en la notificación.
     */
    const showNotification = useCallback((msg: string) => {
        setMessage(msg);
        setIsVisible(true);
        
        // Oculta la notificación automáticamente después de 3 segundos.
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    }, []);

    /**
     * @description Cierra la notificación manualmente, por ejemplo, al hacer clic en el botón de cierre.
     */
    const closeNotification = () => setIsVisible(false);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            {/* El componente de la notificación se renderiza aquí, pero su visibilidad es controlada por CSS. */}
            <div className={`notification ${isVisible ? "show" : ""}`}>
                <span id="notification-message">{message}</span>
                <button className="notification-close" onClick={closeNotification}>
                    &times;
                </button>
            </div>
        </NotificationContext.Provider>
    );
}

/**
 * @description Hook personalizado para consumir el `NotificationContext`.
 * Proporciona una forma sencilla y segura de acceder a la función `showNotification` desde cualquier
 * componente dentro del `NotificationProvider`.
 *
 * @throws {Error} Lanza un error si se intenta usar fuera de un `NotificationProvider`,
 * previniendo errores de ejecución.
 * @returns {NotificationContextType} El valor del contexto, que contiene la función `showNotification`.
 */
export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification debe usarse dentro de un NotificationProvider");
    }
    return context;
}