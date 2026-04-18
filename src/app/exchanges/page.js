"use client";
import { useState, useEffect } from "react";

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({ id: null, message: "", type: "" });

    const fetchExchanges = async () => {
        try {
            const res = await fetch("/api/exchanges");
            const data = await res.json();
            setExchanges(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchanges();
    }, []);

    const showNotice = (id, message, type) => {
        setNotice({ id, message, type });
        setTimeout(() => setNotice({ id: null, message: "", type: "" }), 3000);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/exchanges/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                showNotice(id, `Solicitud ${newStatus === 'accepted' ? 'aceptada' : 'cancelada'}`, "success");
                fetchExchanges();
            } else {
                showNotice(id, "Error al actualizar", "error");
            }
        } catch (error) {
            showNotice(id, "Error de conexión", "error");
        }
    };

    const deleteExchange = async (id) => {
        try {
            const res = await fetch(`/api/exchanges/${id}`, { method: "DELETE" });
            if (res.ok) fetchExchanges();
        } catch (error) {
            showNotice(id, "No se pudo eliminar", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-gray-500 tracking-[0.3em] uppercase text-xs animate-pulse">Cargando biblioteca...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-5xl mx-auto">
                {/* Título de la sección */}
                <div className="text-left mb-16 border-l-2 border-white pl-6">
                    <h1 className="font-serif-logo text-5xl md:text-3xl mb-1">
                        Intercambios
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">
                        Gestión de Solicitudes
                    </p>
                </div>

                <div className="grid gap-8">
                    {exchanges.map((ex) => (
                        <div key={ex._id} className="relative group bg-[#0a0a0a] border border-gray-900 rounded-lg p-8 transition-all hover:border-gray-700">

                            {/* AVISO INTERNO */}
                            {notice.id === ex._id && (
                                <div className={`absolute top-0 left-0 w-full p-2 text-center text-[10px] uppercase tracking-widest font-bold rounded-t-lg transition-all ${notice.type === "success" ? "bg-white text-black" : "bg-red-900 text-white"
                                    }`}>
                                    {notice.message}
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mt-2">
                                {/* Bloque de libros */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                    <div className="flex flex-col border-l border-gray-800 pl-6">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">Ofreces</p>
                                        <h2 className="text-xl font-medium tracking-tight text-white mb-1">
                                            {ex.book_offered?.tittle}
                                        </h2>
                                        <p className="text-[11px] text-gray-500 italic">de {ex.book_offered?.author || "Autor desconocido"}</p>
                                    </div>

                                    <div className="flex flex-col border-l border-gray-800 pl-6">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">Recibes</p>
                                        <h2 className="text-xl font-medium tracking-tight text-white mb-1">
                                            {ex.book_requested?.tittle}
                                        </h2>
                                        <p className="text-[11px] text-gray-500 italic">de {ex.book_requested?.author || "Autor desconocido"}</p>
                                    </div>
                                </div>

                                {/* Columna de Estado y Acciones */}
                                <div className="flex flex-col items-center lg:items-end justify-center gap-6 min-w-[200px]">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${ex.status === 'pending' ? 'border-yellow-900/50 text-yellow-600 bg-yellow-900/10' :
                                            ex.status === 'accepted' ? 'border-green-900/50 text-green-500 bg-green-900/10' :
                                                'border-gray-800 text-gray-600'
                                        }`}>
                                        {ex.status}
                                    </span>

                                    <div className="flex gap-4">
                                        {ex.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(ex._id, "accepted")}
                                                    className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                                                >
                                                    Aceptar
                                                </button>

                                                <button
                                                    onClick={() => updateStatus(ex._id, "rejected")}
                                                    className="bg-red-700 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}

                                        {ex.status !== 'pending' && (
                                            <button
                                                onClick={() => deleteExchange(ex._id)}
                                                className="text-[9px] uppercase tracking-widest font-bold text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                Eliminar Registro
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fecha sutil */}
                            <div className="mt-8 pt-4 border-t border-gray-900 text-[9px] text-gray-700 uppercase tracking-widest text-right">
                                Solicitud creada el {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}