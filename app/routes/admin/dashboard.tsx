import type { Route } from "./+types/dashboard";
import { useEffect } from "react";
import { useAuth } from "~/services/auth-context";
import { useNavigate, Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Panel de Administración" }];
}

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12 px-4">
      {/* Espaciador para separar del header fijo (igual patrón que pokemons y graficos) */}
      <div className="w-full h-4 md:h-6 lg:h-6"></div>
      <div className="w-full max-w-5xl space-y-8">

        {/* Encabezado */}
        <div className="flex items-end justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 font-[var(--font-encabezados)]">
              Panel Admin
            </h1>
            <p className="text-gray-500 mt-1">
              Gestión centralizada de PokeStore
            </p>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Inventario Pokémon */}
          <Link
            to="/admin/pokemons"
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
            className="group block bg-white rounded-xl p-3 pb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
