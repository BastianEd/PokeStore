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

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    SalesService.getAll().then(setVentas).finally(() => setLoading(false));
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <TopSellingChart sales={ventas} top={5} showImages={false} />
        </div>
        {loading && (
          <div className="text-center text-sm text-gray-500">Cargando datos...</div>
        )}
      </div>
    </div>
  );
}