import type { Route } from "./+types/graficos";
import { useEffect, useState } from "react";
import { useAuth } from "~/services/auth-context";
import { useNavigate } from "react-router";
import { SalesService, type SaleRecord } from "~/services/sales.service";
import TopSellingChart from "~/components/molecules/TopSellingChart";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Gráficos de Ventas" }];
}

export default function AdminGraficos() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    SalesService.getAll()
      .then(data => {
        setVentas([...data]); // clonar para garantizar nueva referencia
        // Debug: console.log("[Graficos] Carga inicial ventas:", data.length);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // Escuchar evento personalizado para refrescar ventas sin recargar la página
  useEffect(() => {
    if (!isAdmin) return;
    const handler = (e: Event) => {
      // Debug: console.log('[Graficos] Evento ventas:actualizado recibido', e);
      SalesService.getAll().then(data => {
        setVentas([...data]);
        // Debug: console.log('[Graficos] Ventas tras evento:', data.length);
      });
    };
    window.addEventListener('ventas:actualizado', handler);
    return () => window.removeEventListener('ventas:actualizado', handler);
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12 px-4">
      <div className="w-full h-4 md:h-6 lg:h-6"></div>
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-[var(--font-encabezados)]">Gráficos</h1>
          <p className="text-gray-500">Visualización resumida de los 5 Pokémon más vendidos.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm relative">
          {refreshing && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center text-xs text-gray-600">
              Actualizando...
            </div>
          )}
          <TopSellingChart sales={ventas} top={5} showImages={false} />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              SalesService.getAll()
                .then(data => {
                  setVentas([...data]);
                  // Debug: console.log('[Graficos] Manual refresh ventas:', data.length);
                })
                .finally(() => setRefreshing(false));
            }}
            className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
            title="Refrescar datos"
            disabled={refreshing}
          >
            {refreshing ? '...' : 'Refrescar'}
          </button>
          <button
            onClick={() => {
              // Forzar re-render incluso si datos iguales
              setVentas(v => [...v]);
            }}
            className="text-xs px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
            title="Forzar re-render"
          >
            Re-render
          </button>
        </div>
        {loading && (
          <div className="text-center text-sm text-gray-500">Cargando datos...</div>
        )}
      </div>
    </div>
  );
}