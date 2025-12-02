import React from "react";
import type { SaleRecord } from "~/services/sales.service";

interface TopSellingChartProps {
  sales: SaleRecord[];
  top?: number; // cuantos mostrar
  showImages?: boolean; // ocultar imágenes para versión gráfica simple
}

interface AggItem {
  pokedexId: number;
  nombre: string;
  imagen: string;
  quantity: number;
}

function aggregateSales(sales: SaleRecord[]): AggItem[] {
  const map = new Map<number, AggItem>();
  for (const record of sales) {
    for (const item of record.items) {
      const prev = map.get(item.pokedexId);
      if (prev) prev.quantity += item.quantity;
      else map.set(item.pokedexId, { pokedexId: item.pokedexId, nombre: item.nombre, imagen: item.imagen, quantity: item.quantity });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

// Paleta fija (5 colores) - se puede extender
const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6"]; // rojo, amarillo, azul, verde, violeta

export const TopSellingChart: React.FC<TopSellingChartProps> = ({ sales, top = 5, showImages = true }) => {
  const aggregated = aggregateSales(sales).slice(0, top);
  const total = aggregated.reduce((s, it) => s + it.quantity, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold font-[var(--font-encabezados)] text-gray-800 mb-4">Pokémon más vendidos (Top {aggregated.length})</h2>
      {aggregated.length === 0 && <div className="text-gray-500 text-sm">Aún no hay datos de ventas para mostrar.</div>}
      {aggregated.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Pie chart */}
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx={100} cy={100} r={92} fill="#fff" stroke="#e5e7eb" strokeWidth={2} />
              {(() => {
                const r = 92;
                const C = 2 * Math.PI * r; // circunferencia
                let cumulative = 0;
                return aggregated.map((item, idx) => {
                  const frac = total === 0 ? 0 : item.quantity / total;
                  const length = frac * C;
                  const dashArray = `${length} ${C - length}`;
                  const dashOffset = C - cumulative * C;
                  cumulative += frac;
                  return (
                    <circle
                      key={item.pokedexId}
                      cx={100}
                      cy={100}
                      r={r}
                      fill="transparent"
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={16}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="butt"
                      transform="rotate(-90 100 100)"
                    />
                  );
                });
              })()}
            </svg>
            {/* Total centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs uppercase tracking-wide text-gray-500">Total unidades</span>
              <span className="text-xl font-bold text-gray-800">{total}</span>
            </div>
          </div>
          {/* Leyenda */}
          <div className="flex-1 w-full space-y-3">
            {aggregated.map((item, idx) => {
              const pct = total === 0 ? 0 : (item.quantity / total) * 100;
              return (
                <div key={item.pokedexId} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm" style={{ background: COLORS[idx % COLORS.length] }} />
                  {showImages && <img src={item.imagen} alt={item.nombre} className="w-8 h-8 object-contain" />}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 flex justify-between">
                      <span className="truncate">{item.nombre}</span>
                      <span className="text-gray-500 font-normal">{item.quantity}u</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded mt-1 overflow-hidden">
                      <div className="h-full rounded bg-gray-300" style={{ width: `${pct}%`, background: COLORS[idx % COLORS.length] }} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{pct.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSellingChart;