import type { Route } from "./+types/ventas";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "~/services/auth-context";
import { useNavigate } from "react-router";
import { SalesService, type SaleRecord } from "~/services/sales.service";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Historial de Ventas" }];
}

export default function AdminVentas() {
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
    SalesService.getAll()
      .then(setVentas)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const totalRecaudado = useMemo(() => {
    return ventas.reduce((sum, v) => sum + v.items.reduce((s, it) => s + it.precio * it.quantity, 0), 0);
  }, [ventas]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12 px-4">
      {/* Espaciador para separar del header fijo (patrón consistente) */}
      <div className="w-full h-4 md:h-6 lg:h-6"></div>
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-[var(--font-encabezados)]">Historial de Ventas</h1>
            <p className="text-gray-500">Ventas registradas localmente por usuario (demo)</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total recaudado</div>
            <div className="text-2xl font-extrabold text-green-700">
              {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(totalRecaudado)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Compra</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4 text-right">Ítems</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td className="px-6 py-10 text-center text-gray-500" colSpan={5}>Cargando ventas...</td>
                  </tr>
                )}
                {!loading && ventas.length === 0 && (
                  <tr>
                    <td className="px-6 py-10 text-center text-gray-500" colSpan={5}>Aún no hay ventas registradas.</td>
                  </tr>
                )}
                {!loading && ventas.map((v) => {
                  const count = v.items.reduce((sum, it) => sum + it.quantity, 0);
                  const total = v.items.reduce((sum, it) => sum + it.precio * it.quantity, 0);
                  return (
                    <tr key={`${v.userId}-${v.id}`} className="hover:bg-gray-50/60">
                      <td className="px-6 py-4 font-semibold text-gray-800">#{v.id}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(v.fecha).toLocaleString("es-CL")}</td>
                      <td className="px-6 py-4 text-gray-600">Usuario #{v.userId}</td>
                      <td className="px-6 py-4 text-right font-medium">{count}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-700">
                        {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
