import type { Route } from "./+types/dashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/services/auth-context";
import {
    FiUsers,
    FiShoppingBag,
    FiBox,
    FiActivity,
    FiTrendingUp
} from "react-icons/fi";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Panel de Control - PokeStore Admin" }];
}

// Componente para las tarjetas de estadísticas
function StatCard({ title, value, icon, color, trend }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
                </div>
                <div className={`${color} text-white p-3 rounded-lg shadow-sm`}>
                    {icon}
                </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">
                {trend}
            </p>
        </div>
    );
}

export default function AdminDashboard() {
    const { usuarioActual, isAdmin, isLoading } = useAuth();
    const navigate = useNavigate();

    // PROTECCIÓN DE RUTA: Si no es admin, fuera.
    useEffect(() => {
        if (!isLoading && !isAdmin) {
            navigate("/");
        }
    }, [isAdmin, isLoading, navigate]);

    if (isLoading) return <div className="p-10 text-center">Cargando panel...</div>;
    if (!isAdmin) return null;

    return (
        <section className="section active" style={{ backgroundColor: "#f3f4f6", minHeight: "90vh", paddingBottom: "2rem" }}>
            <div className="container" style={{ padding: "2rem 1rem" }}>

                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: 'var(--font-encabezados)'}}>
                            Centro de Mando Pokémon
                        </h2>
                        <p className="text-gray-600">Bienvenido, Profesor {usuarioActual?.email}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm font-semibold text-green-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Sistema Operativo v2.0
                        </span>
                    </div>
                </div>

                {/* Grid de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Ventas Totales"
                        value="$ 1.250.000"
                        icon={<FiTrendingUp />}
                        color="bg-blue-600"
                        trend="+15% vs mes anterior"
                    />
                    <StatCard
                        title="Pedidos Pendientes"
                        value="12"
                        icon={<FiShoppingBag />}
                        color="bg-orange-500"
                        trend="3 urgentes"
                    />
                    <StatCard
                        title="Pokémon en Stock"
                        value="150"
                        icon={<FiBox />}
                        color="bg-purple-600"
                        trend="Inventario saludable"
                    />
                    <StatCard
                        title="Entrenadores"
                        value="843"
                        icon={<FiUsers />}
                        color="bg-red-500"
                        trend="+5 nuevos hoy"
                    />
                </div>

                {/* Panel Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Tabla de Ventas */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Últimas Capturas (Ventas)</h3>
                            <button className="text-blue-600 text-sm hover:underline font-medium">Ver todas</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="text-gray-500 text-sm border-b border-gray-100">
                                    <th className="py-3 font-medium">Entrenador</th>
                                    <th className="py-3 font-medium">Pokémon</th>
                                    <th className="py-3 font-medium">Estado</th>
                                    <th className="py-3 font-medium text-right">Monto</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm">
                                {[
                                    { user: "Ash K.", pk: "Pikachu", status: "Completado", price: 75000 },
                                    { user: "Misty W.", pk: "Starmie", status: "Enviando", price: 45000 },
                                    { user: "Brock", pk: "Onix", status: "Pendiente", price: 60000 },
                                    { user: "Gary O.", pk: "Eevee", status: "Completado", price: 55000 },
                                    { user: "Jessie", pk: "Wobbuffet", status: "Cancelado", price: 30000 },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-4 text-gray-800 font-medium">{row.user}</td>
                                        <td className="py-4 text-gray-600">{row.pk}</td>
                                        <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${row.status === 'Completado' ? 'bg-green-100 text-green-700' :
                                                    row.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                                        row.status === 'Enviando' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                    {row.status}
                                                </span>
                                        </td>
                                        <td className="py-4 text-right text-gray-800">
                                            ${row.price.toLocaleString('es-CL')}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Panel Lateral de Acciones */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión Rápida</h3>

                        <div className="flex flex-col gap-4 flex-grow">
                            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <FiBox size={20} />
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-800">Agregar Pokémon</span>
                                    <span className="text-xs text-gray-500">Nuevo stock</span>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group text-left">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <FiActivity size={20} />
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-800">Reporte Mensual</span>
                                    <span className="text-xs text-gray-500">Descargar PDF</span>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Actividad Reciente</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm items-start">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                                    <p className="text-gray-600 leading-tight">Nuevo registro: <span className="font-semibold text-gray-800">Entrenador Red</span></p>
                                </li>
                                <li className="flex gap-3 text-sm items-start">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-400 flex-shrink-0"></div>
                                    <p className="text-gray-600 leading-tight">Stock bajo: <span className="font-semibold text-gray-800">Poción Máxima</span></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}