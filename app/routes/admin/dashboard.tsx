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
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex items-end justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 font-[var(--font-encabezados)]">Panel Admin</h1>
            <p className="text-gray-500 mt-1">Gestión centralizada de PokeStore</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/pokemons" className="group block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">📦</div>
              <div>
                <h2 className="text-xl font-bold">Inventario Pokémon</h2>
                <p className="text-gray-500">CRUD y gestión de catálogo</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/ventas" className="group block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">💳</div>
              <div>
                <h2 className="text-xl font-bold">Historial de Ventas</h2>
                <p className="text-gray-500">Compras registradas por usuario</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
