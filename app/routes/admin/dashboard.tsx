import type { Route } from "./+types/dashboard";
import { useEffect } from "react";
import { useAuth } from "~/services/auth-context";
import { useNavigate, Link } from "react-router";

/**
 * @description Genera los metadatos para la página del panel de administración.
 * @param {Route.MetaArgs} args - Argumentos proporcionados por el enrutador.
 * @returns {Array<Object>} Un array de objetos de metadatos para el `<head>` del documento.
 */
export function meta({}: Route.MetaArgs) {
  return [{ title: "Panel de Administración" }];
}

/**
 * @description Componente que renderiza el panel de control principal para administradores.
 *
 * Esta página actúa como el punto de entrada y centro de navegación para todas las
 * funcionalidades de administración de la tienda. Sus responsabilidades clave son:
 * - **Protección de Ruta**: Utiliza el hook `useAuth` para verificar si el usuario
 *   tiene permisos de administrador. Si no es así, o si la sesión aún no se ha cargado,
 *   redirige al usuario a la página de inicio para prevenir el acceso no autorizado.
 * - **Navegación**: Presenta una serie de tarjetas de enlace que dirigen a las
 *   diferentes secciones de gestión: Inventario de Pokémon, Historial de Ventas y Gráficos.
 *
 * @returns {React.ReactElement | null} La interfaz del panel de administración o `null` si el usuario no tiene los permisos necesarios.
 */
export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Efecto para proteger la ruta, redirigiendo si el usuario no es admin.
  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  // Renderiza null mientras se verifica el estado de autenticación para evitar un parpadeo de contenido.
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12 px-4">
      {/* Espaciador para separar del header fijo (igual patrón que pokemons y graficos) */}
      <div className="w-full h-4 md:h-6 lg:h-6"></div>
      <div className="w-full max-w-5xl space-y-8">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gray-200 pb-6">
          <div className="text-center md:text-left w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 font-[var(--font-encabezados)]">
              Panel Admin
            </h1>
            <p className="text-gray-500 mt-1">
              Gestión centralizada de PokeStore
            </p>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center md:justify-items-stretch">

          {/* Inventario Pokémon */}
          <Link
            to="/admin/pokemons"
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm md:max-w-none"
          >
            <div className="flex items-start gap-4">

              {/* Icono */}
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                📦
              </div>

              {/* Textos alineados */}
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold !leading-[1.1]" style={{ marginTop: "12px", marginBottom: "2px" }}>
                  Inventario Pokémon
                </h2>
                <p className="text-gray-500 !leading-tight" style={{ marginTop: '0px' }}>
                  CRUD y gestión de catálogo
                </p>
              </div>

            </div>
          </Link>

          {/* Historial de Ventas */}
          <Link
            to="/admin/ventas"
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm md:max-w-none"
          >
            <div className="flex items-start gap-4">

              <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                💳
              </div>

              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold leading-[1.1]" style={{ marginTop: "12px", marginBottom: "2px" }}>
                  Historial de Ventas
                </h2>
                <p className="text-gray-500 leading-tight" style={{ marginTop: "0px" }}>
                  Compras registradas por usuario
                </p>
              </div>

            </div>
          </Link>

          {/* Gráficos */}
          <Link
            to="/admin/graficos"
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm md:max-w-none"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                📊
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold leading-[1.1]" style={{ marginTop: "12px", marginBottom: "2px" }}>
                  Gráficos
                </h2>
                <p className="text-gray-500 leading-tight" style={{ marginTop: "0px" }}>
                  Top 5 Pokémon más vendidos
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}