"use client";//permite que se usar los hooks 
import { useState, useEffect } from "react"; // Hooks de React para manejar el estado y efectos secundarios
/*Pagina de Perfil de Usuario */
export default function ProfilePage() {
    //ESTADOS DE DATOS
    const [user, setUser] = useState(null);  // Perfil del usuario actual
    const [booksCount, setBooksCount] = useState(0); // Contador de libros publicados por el usuario
    const [exchanges, setExchanges] = useState([]); // Lista filtrada de intercambios del usuario
    const [loading, setLoading] = useState(true); // Estado de carga inicial

    // Función para cargar todos los datos (la llamamos al inicio y al actualizar un estado)
    const loadProfileData = async () => {
        try {
            //Obtener datos del usuario logueado
            const userRes = await fetch("/api/auth/me");
            const userData = await userRes.json();
            if (!userRes.ok) throw new Error("No autorizado");
            const myUser = userData.user;
            setUser(myUser);
            //Obtener libros y filtrar los que yo publiqué.Además, de que lo filtramos por la ID del dueño.
            const booksRes = await fetch("/api/books");
            if (booksRes.ok) {
                const booksData = await booksRes.json();
                const myBooks = booksData.filter(b =>
                    //Se comprueba flexible por si el owner viene como objeto o solo ID 
                    (b.owner?._id || b.owner) === myUser._id
                );
                setBooksCount(myBooks.length);
            }
            //Gestión de Intercambios
            //Obtener intercambios y filtrar donde yo participo (de o para mí)
            const exchRes = await fetch("/api/exchanges");
            if (exchRes.ok) {
                const exchData = await exchRes.json();
                const myExchanges = exchData.filter(ex => {
                    const fromId = ex.user_from?._id || ex.user_from;
                    const toId = ex.user_to?._id || ex.user_to;
                    return fromId === myUser._id || toId === myUser._id;
                });
                setExchanges(myExchanges);
            }
        } catch (error) { //En el caso de que no se cargue el perfil
            console.error("Error al cargar perfil:", error); //Manejo de errores 
        } finally {
            setLoading(false);
        }
    };
    // Disparamos la carga al montar el componente
    useEffect(() => {
        loadProfileData();
    }, []);

    // Función para Aceptar o Rechazar intercambios
    const updateExchangeStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/exchanges/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Recargamos los datos para ver el cambio de estado inmediatamente
                loadProfileData();
            }
        } catch (error) { //En el caso de que no se haya actualizado
            console.error("Error al actualizar:", error); //Manejo de errores 
        }
    };
    
    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white animate-pulse">Cargando Metamorfosis...</p>
        </div>
    );
    //FRONTED----VOY POR AQUI
    return (
        <div className="min-h-screen bg-black text-white p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* CABECERA */}
                <div className="mb-20 pt-10">
                    <h1 className="text-6xl font-serif-logo italic mb-2">
                        {user?.name || "Usuario"}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-600">Miembro de Metamorfosis</p>
                </div>

                {/* ESTADÍSTICAS */}
                <div className="grid grid-cols-2 gap-px bg-gray-900 border border-gray-900 mb-20">
                    <div className="bg-black p-12 text-center">
                        <span className="block text-5xl font-extralight mb-2">{booksCount}</span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 italic">Libros Compartidos</span>
                    </div>
                    <div className="bg-black p-12 text-center">
                        <span className="block text-5xl font-extralight mb-2">{exchanges.length}</span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 italic">Intercambios</span>
                    </div>
                </div>

                {/* LISTA DE INTERCAMBIOS */}
                <div className="space-y-6">
                    <h2 className="text-[11px] uppercase tracking-[0.4em] mb-10 border-b border-gray-900 pb-4 text-gray-500">
                        Historial y Gestión
                    </h2>

                    {exchanges.length === 0 ? (
                        <p className="text-[10px] text-gray-800 italic uppercase tracking-widest">No hay movimientos en tu biblioteca todavía.</p>
                    ) : (
                        exchanges.map((ex) => (
                            <div key={ex._id} className="bg-[#050505] border border-gray-900 p-8 flex items-center justify-between mb-4 group hover:border-gray-700 transition-all">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                                        Libro solicitado: <span className="text-white italic">{ex.book_requested?.tittle || "Sin título"}</span>
                                    </p>

                                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                                        {ex.user_from?._id === user?._id ? "Enviado a: " : "Solicitado por: "}
                                        <span className="text-gray-400">
                                            {ex.user_from?._id === user?._id ? ex.user_to?.name : ex.user_from?.name}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-8">
                                    {/* BADGE DE ESTADO */}
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${ex.status === 'accepted' ? 'border-green-900/40 text-green-600' :
                                            ex.status === 'rejected' ? 'border-red-900/40 text-red-600' :
                                                'border-yellow-900/40 text-yellow-600'
                                        }`}>
                                        {ex.status === 'pending' ? 'PENDIENTE' :
                                            ex.status === 'accepted' ? 'ACEPTADO' :
                                                ex.status === 'rejected' ? 'RECHAZADO' : 'CANCELADO'}
                                    </span>

                                    {/* BOTONES DE ACCIÓN: Solo si soy el receptor y está pendiente */}
                                    {ex.status === 'pending' && ex.user_to?._id === user?._id && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateExchangeStatus(ex._id, 'accepted')}
                                                className="bg-white text-black text-[8px] font-black px-5 py-2 rounded-full uppercase hover:bg-gray-200 transition-all"
                                            >
                                                Aceptar
                                            </button>
                                            <button
                                                onClick={() => updateExchangeStatus(ex._id, 'rejected')}
                                                className="border border-gray-800 text-gray-500 text-[8px] font-black px-5 py-2 rounded-full uppercase hover:border-red-500 hover:text-red-500 transition-all"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}