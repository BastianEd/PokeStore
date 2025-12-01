import type { Route } from "./+types/pokemons";
import { useEffect, useState } from "react";
import { ProductService, type UpdatePokemonDto } from "~/services/product.service";
import type { Pokemon } from "~/data/products";
import { useAuth } from "~/services/auth-context";
import { useNavigate } from "react-router";
import { FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";
import { useNotification } from "~/services/notification-context"; 

export function meta({}: Route.MetaArgs) {
    return [{ title: "Administración de Pokemones" }];
}

// Estilo base para los botones pequeños
const btnActionStyle = "p-2 rounded-full transition-colors shadow-sm hover:shadow-md";

export default function AdminPokemons() {
    const { isAdmin, isLoading } = useAuth();
    const navigate = useNavigate();
    // Obtenemos la función para mostrar notificaciones
    const { showNotification } = useNotification(); 

    // Estado de datos
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Estado de edición (Fila actual)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<UpdatePokemonDto>({});

    // 1. Protección de Ruta: Solo Admins
    useEffect(() => {
        if (!isLoading && !isAdmin) navigate("/");
    }, [isAdmin, isLoading, navigate]);

    // 2. Carga Inicial de Datos
    useEffect(() => {
        if (isAdmin) loadData();
    }, [isAdmin]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            const data = await ProductService.getAll();
            // Ordenamos por ID para que no salten al editar
            setPokemons(data.sort((a, b) => a.pokedexId - b.pokedexId));
        } catch (e) {
            console.error("Error cargando inventario:", e);
        } finally {
            setLoadingData(false);
        }
    };

    // --- ACCIONES DEL CRUD ---

    // POST /seed
    const handleAdd = async () => {
        try {
            setLoadingData(true);
            await ProductService.seed();
            await loadData(); // Recargamos para mostrar el nuevo
            // Notificación de éxito
            showNotification("¡20 nuevos Pokémon han sido generados y añadidos al inventario! 🐾");
        } catch (e) {
            alert("No se pudo agregar. Verifica si el servicio de PokéAPI está disponible.");
        } finally {
            setLoadingData(false);
        }
    };

    // DELETE /{id}
    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de liberar a este Pokémon? No podrás deshacerlo.")) return;

        try {
            await ProductService.delete(id);
            // Actualización (borramos de la lista visualmente)
            setPokemons(prev => prev.filter(p => p.pokedexId !== id));
            // Notificación de éxito
            showNotification(`Pokémon #${id} ha sido liberado del inventario. 🗑️`);
        } catch (e) {
            alert("Error al eliminar el Pokémon.");
        }
    };

    // PATCH (Inicio de edición)
    const startEdit = (p: Pokemon) => {
        setEditingId(p.pokedexId);
        setEditForm({
            nombre: p.nombre,
            tipo: p.tipoPrincipal,
            descripcion: p.descripcion,
            precio: p.precio
        });
    };

    // PATCH (Guardar cambios)
    const saveEdit = async (id: number) => {
        try {
            await ProductService.update(id, editForm);
            setEditingId(null);
            loadData(); // Recargamos para asegurar datos frescos
            // Notificación de éxito
            showNotification(`Pokémon #${id} actualizado correctamente. 📝`);
        } catch (e) {
            alert("Error al guardar los cambios.");
        }
    };

    if (!isAdmin) return null;

    return (
        // LAYOUT: Centrado, fondo gris suave, padding superior para el header
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12 px-4">
            {/* Espaciador para separar del header fijo */}
            <div className="w-full h-4 md:h-6 lg:h-6"></div>

            {/* Contenedor ancho limitado */}
            <div className="w-full max-w-6xl space-y-8">

                {/* Encabezado de la página */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-[var(--font-encabezados)]">
                            Inventario Pokémon
                        </h1>
                        <p className="text-gray-500 mt-1">Gestión de base de datos en tiempo real</p>
                    </div>

                    {/* BOTÓN AGREGAR (Principal) */}
                    <button
                        onClick={handleAdd}
                        disabled={loadingData}
                        className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        <div className="bg-white/20 rounded-full p-1 group-hover:rotate-90 transition-transform">
                            <FiPlus size={20} />
                        </div>
                        <span>{loadingData ? 'Conectando...' : 'Generar Pokémon (Seed)'}</span>
                    </button>
                </div>

                {/* TABLA DE DATOS */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
                            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-5 text-center">ID</th>
                                <th className="px-6 py-5 text-center">Visualización</th>
                                <th className="px-6 py-5">Detalles</th>
                                <th className="px-6 py-5 w-1/3">Descripción</th>
                                <th className="px-6 py-5 text-right">Valor</th>
                                <th className="px-6 py-5 text-center">Control</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {pokemons.map((p) => {
                                const isEditing = editingId === p.pokedexId;
                                const inputClass = "w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border";

                                return (
                                    <tr key={p.pokedexId} className={`transition-colors ${isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>

                                        {/* ID */}
                                        <td className="px-6 py-4 text-gray-400 font-mono font-medium text-center">
                                            #{String(p.pokedexId).padStart(3, '0')}
                                        </td>

                                        {/* IMAGEN GRANDE (Ajustada a tu gusto) */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <div className="h-24 w-24 bg-white rounded-2xl border-2 border-gray-100 p-2 flex items-center justify-center shadow-sm group hover:border-blue-200 transition-colors">
                                                    <img
                                                        src={p.imagen}
                                                        alt={p.nombre}
                                                        className="h-full w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* NOMBRE Y TIPO */}
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        className={inputClass}
                                                        value={editForm.nombre}
                                                        onChange={e => setEditForm({...editForm, nombre: e.target.value})}
                                                        placeholder="Nombre"
                                                    />
                                                    <input
                                                        className={inputClass}
                                                        value={editForm.tipo}
                                                        onChange={e => setEditForm({...editForm, tipo: e.target.value})}
                                                        placeholder="Tipo"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-bold text-gray-800 text-lg">{p.nombre}</p>
                                                    <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                                            {p.tipoPrincipal}
                                                        </span>
                                                </div>
                                            )}
                                        </td>

                                        {/* DESCRIPCIÓN */}
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <textarea
                                                    className={inputClass}
                                                    rows={3}
                                                    value={editForm.descripcion}
                                                    onChange={e => setEditForm({...editForm, descripcion: e.target.value})}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                    {p.descripcion}
                                                </p>
                                            )}
                                        </td>

                                        {/* PRECIO */}
                                        <td className="px-6 py-4 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className={`${inputClass} text-right`}
                                                    value={editForm.precio}
                                                    onChange={e => setEditForm({...editForm, precio: Number(e.target.value)})}
                                                />
                                            ) : (
                                                <span className="text-green-600 font-bold font-mono text-base">
                                                        ${p.precio.toLocaleString('es-CL')}
                                                    </span>
                                            )}
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={() => saveEdit(p.pokedexId)} className={`${btnActionStyle} bg-green-100 text-green-700 hover:bg-green-200`} title="Guardar">
                                                            <FiSave size={18} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className={`${btnActionStyle} bg-gray-100 text-gray-600 hover:bg-gray-200`} title="Cancelar">
                                                            <FiX size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEdit(p)} className={`${btnActionStyle} bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700`} title="Editar">
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(p.pokedexId)} className={`${btnActionStyle} bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700`} title="Eliminar">
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* ESTADO VACÍO */}
                    {pokemons.length === 0 && !loadingData && (
                        <div className="p-16 text-center">
                            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📦</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Inventario vacío</h3>
                            <p className="text-gray-500 mt-1 mb-6">No hay Pokémon registrados en la base de datos local.</p>
                            <button onClick={handleAdd} className="text-blue-600 font-semibold hover:underline">
                                Generar el primer Pokémon ahora &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}