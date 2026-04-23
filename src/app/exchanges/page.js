"use client";
import { useState, useEffect, useRef } from "react";

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({ id: null, message: "", type: "" });
    const timerRef = useRef(null); // Para limpiar el setTimeout si el usuario navega

    const fetchData = async () => {
        try {
            const userRes = await fetch("/api/auth/me");
            const userData = await userRes.json();
            if (userRes.ok) setUser(userData.user);

            const res = await fetch("/api/exchanges");
            const data = await res.json();
            setExchanges(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al sincronizar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Limpiamos el timer si el usuario navega fuera
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/exchanges/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (res.ok) {
                setNotice({ id, message: `Solicitud ${newStatus}`, type: "success" });
                await fetchData();

                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    setNotice({ id: null, message: "", type: "" });
                }, 3000);
            } else {  //Por si hay un error al actualizar 
                alert(data.error || "Error al actualizar");
            }
        } catch (error) { //Cuando hay un error de conexion
            console.error("Error de conexión:", error); //Manejo de errores 
        }
    };

    if (loading) return <div className="p-20 text-white bg-black">Cargando...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                <h1 className="text-2xl font-serif italic mb-4">Intercambios</h1>

                {/* Lista vacía */}
                {exchanges.length === 0 && (
                    <p className="text-gray-600 text-center text-sm">
                        No hay intercambios todavía.
                    </p>
                )}

                {exchanges.map((ex) => {
                    const myId = String(user?._id || user?.id || "");
                    const receiverId = String(ex.user_to?._id || ex.user_to || "");
                    const isReceiver = myId === receiverId;

                    return (
                        <div
                            key={ex._id}
                            className="border border-gray-900 bg-[#080808] p-8 rounded flex flex-col gap-4 relative"
                        >
                            {/* Alerta de éxito */}
                            {notice.id === ex._id && (
                                <div className="absolute top-0 left-0 w-full bg-white text-black text-[10px] font-bold py-1 text-center rounded-t">
                                    {notice.message.toUpperCase()}
                                </div>
                            )}

                            {/* Información del intercambio */}
                            <div className="flex justify-between items-start flex-wrap gap-4 mt-2">

                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-600 text-[10px] uppercase tracking-tighter">De:</p>
                                    <p className="text-sm">{ex.user_from?.name || "Desconocido"}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-600 text-[10px] uppercase tracking-tighter">Para:</p>
                                    <p className="text-sm">{ex.user_to?.name || "Desconocido"}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-600 text-[10px] uppercase tracking-tighter">Libro Ofrecido:</p>
                                    {/* Cambia "title" por "tittle" si así está en tu modelo */}
                                    <p className="text-lg italic font-serif">{ex.book_offered?.title || "Sin título"}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-600 text-[10px] uppercase tracking-tighter">Libro Solicitado:</p>
                                    {/* Cambia "title" por "tittle" si así está en tu modelo */}
                                    <p className="text-lg italic font-serif">{ex.book_requested?.title || "Sin título"}</p>
                                </div>

                            </div>

                            {/* Estado y botones */}
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <span className={`text-[10px] px-3 py-1 rounded border ${
                                    ex.status === "pending"
                                        ? "text-yellow-600 border-yellow-900"
                                        : ex.status === "accepted"
                                        ? "text-green-600 border-green-900"
                                        : "text-red-600 border-red-900"
                                }`}>
                                    {ex.status.toUpperCase()}
                                </span>

                                {/* Botones solo si está pendiente y eres el receptor */}
                                {ex.status === "pending" && isReceiver && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateStatus(ex._id, "accepted")}
                                            className="bg-white text-black px-6 py-2 text-[10px] font-bold hover:bg-gray-200 transition-all"
                                        >
                                            ACEPTAR
                                        </button>
                                        <button
                                            onClick={() => updateStatus(ex._id, "rejected")}
                                            className="border border-gray-700 text-gray-500 px-6 py-2 text-[10px] font-bold hover:text-red-500 hover:border-red-500 transition-all"
                                        >
                                            RECHAZAR
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}