"use client"; //permite que se usar los hooks 
import { useState, useEffect } from "react"; // Hooks de React para manejar el estado y efectos secundarios

export default function ExchangesPage() {
    //ESTADOS DE DATOS
    const [exchanges, setExchanges] = useState([]); // Lista de intercambios desde Mongo
    const [user, setUser] = useState(null); // Añadimos estado para el usuario
    const [loading, setLoading] = useState(true); // Control de la pantalla de carga
    //Estado para que las notificaciones visuales breves
    const [notice, setNotice] = useState({ id: null, message: "", type: "" });
    //Carga los datos iniciales: Se sincroniza el usuario actual y sus intercambios
    const fetchData = async () => {
        try {
            //Obtener mi usuario para saber si soy emisor o receptor
            const userRes = await fetch("/api/auth/me");
            const userData = await userRes.json();
            if (userRes.ok) setUser(userData.user);
            //Obtener intercambios
            const res = await fetch("/api/exchanges");
            const data = await res.json();
            setExchanges(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    //Efecto de montaje
    useEffect(() => {
        fetchData();
    }, []);
    //Sistema de aviso temporales(alertas), se muestra un mensaje que dura 30 segundos y se elimina
    const showNotice = (id, message, type) => {
        setNotice({ id, message, type });
        setTimeout(() => setNotice({ id: null, message: "", type: "" }), 3000);
    };
    //Gestión de las solicitudes 
    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/exchanges/${id}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                showNotice(id, `Solicitud ${newStatus === 'accepted' ? 'aceptada' : 'rechazada'}`, "success");
                fetchData();  
            } {/*// Refrescamos la lista para mostrar el cambio de estado
             */}
        } catch (error) { //En el caso de que haya un errore de conexión
            showNotice(id, "Error de conexión", "error"); //Manejo de errores 
        }
    };
    //FRONTED
    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-gray-500 tracking-[0.5em] uppercase text-[10px] animate-pulse italic">Cargando biblioteca...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-5xl mx-auto">
                {/*CABECERA*/}
                <div className="text-left mb-16 border-l-2 border-white pl-6">
                    <h1 className="font-serif-logo text-4xl mb-1 italic">Intercambios</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">Gestión de Solicitudes</p>
                </div>
                {/*Lista de tarjetas de intercambio*/}
                <div className="grid gap-8">
                    {exchanges.map((ex) => {
                        // Determina si el usuario está logueado es quien debe de aceptar / rechazar
                        const isReceiver = ex.user_to?._id === user?._id || ex.user_to === user?._id;
                        
                        return (
                            <div key={ex._id} className="relative group bg-[#050505] border border-gray-900 rounded-sm p-10 transition-all hover:border-gray-700">
                                {/*Banner de notificaciones*/}
                                {notice.id === ex._id && (
                                    <div className={`absolute top-0 left-0 w-full p-2 text-center text-[9px] uppercase tracking-widest font-black transition-all ${
                                        notice.type === "success" ? "bg-white text-black" : "bg-red-950 text-red-500 border-b border-red-900"
                                    }`}>
                                        {notice.message}
                                    </div>
                                )}
                                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mt-2">
                                    {/* Comparativa visual: Libro Ofrecido vs Solicitado */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                                        {/* Detalle del libro que el emisor entrega */}
                                        <div className="flex flex-col border-l border-gray-900 pl-6">
                                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em] mb-4">Ofrecido</p>
                                            <h2 className="text-xl font-light tracking-tight text-white mb-1 italic">{ex.book_offered?.tittle}</h2>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{ex.book_offered?.author}</p>
                                        </div>
                                        {/* Detalle del libro que el emisor quiere recibir */}
                                        <div className="flex flex-col border-l border-gray-900 pl-6">
                                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em] mb-4">Solicitado</p>
                                            <h2 className="text-xl font-light tracking-tight text-white mb-1 italic">{ex.book_requested?.tittle}</h2>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{ex.book_requested?.author}</p>
                                        </div>
                                    </div>
                                    {/* Columna de Acción y Estado */}
                                    <div className="flex flex-col items-center lg:items-end justify-center gap-8 min-w-[220px]">
                                        <span className={`px-5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] border ${
                                            ex.status === 'pending' ? 'border-yellow-900/40 text-yellow-600 bg-yellow-950/10' :
                                            ex.status === 'accepted' ? 'border-green-900/40 text-green-500 bg-green-950/10' : 'border-gray-900 text-gray-700'
                                        }`}>
                                            {ex.status === 'pending' ? 'Pendiente' : ex.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                                        </span>
                                        <div className="flex gap-4">
                                            {/* Solo el receptor de la propuesta ve los botones de decisión y solo si está pendiente. */}
                                            {ex.status === 'pending' && isReceiver ? (
                                                <>
                                                    <button onClick={() => updateStatus(ex._id, "accepted")} className="bg-white text-black px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-200">
                                                        Aceptar
                                                    </button>
                                                    <button onClick={() => updateStatus(ex._id, "rejected")} className="border border-gray-800 text-gray-500 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:text-red-500">
                                                        Rechazar
                                                    </button>
                                                </>
                                            ) : (
                                                /* Si eres el emisor, solo ves un mensaje de espera */
                                                ex.status === 'pending' && (
                                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest italic">Esperando respuesta...</p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}