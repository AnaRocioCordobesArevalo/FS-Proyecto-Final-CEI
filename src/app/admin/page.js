"use client";//Para los hooks 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Hook para redirigir al usuario 

//Zona que no hay que tocar
export default function AdminDashboard() {
    const [users, setUsers] = useState([]); // Muestra la lista de usuarios que tenemos, es decir, el GET users
    const [loading, setLoading] = useState(true); // Controla si mostramos el mensaje de "Cargando"
    const [currentUser, setCurrentUser] = useState(null); // Guarda los datos del admin que está logueado, solo el admin y no usuario ordinario
    const router = useRouter(); // Instancia del router para redirecciones
    // --- EFECTO DE SEGURIDAD Y CARGA --- 
    useEffect(() => {
        const checkAdminAndLoad = async () => {
            try {
                //Verificación de identidad: Consultamos la API 
                const resAuth = await fetch("/api/auth/me");
                const authData = await resAuth.json();
                // SEGURIDAD CRÍTICA(Zona de Peligro): Se verifica si es administrador o no con el booleano que tenemos
                //y en el caso de que no se admin, pues es usuario o una cosa u otra
                if (!resAuth.ok || !authData.user?.is_admin) {
                    router.push("/books"); // Redirección automática a la biblioteca
                    return;
                }
                // Si llegamos aquí, es que el usuario es Admin. Guardamos sus datos.
                setCurrentUser(authData.user);
                //Carga de datos: Una vez confirmado el admin, pedimos todos los usuarios, es decir, el GET de users
                const resUsers = await fetch("/api/users");
                const usersData = await resUsers.json();
                // Guardamos los usuarios en el estado (verificando que sea un array)
                setUsers(Array.isArray(usersData) ? usersData : []);
            } catch (error) {
                console.error("Error en el panel:", error);
            } finally {
                setLoading(false); // Quitamos la pantalla de carga pase lo que pase
            }
        };
        checkAdminAndLoad();
    }, [router]); // Se ejecuta al montar el componente

    // --- LÓGICA DE ELIMINACIÓN ---
    const handleDeleteUser = async (id, name) => {
        // Confirmación nativa del navegador para evitar borrados accidentales
        if (!confirm(`¿EXPULSAR A ${name.toUpperCase()}? Se borrarán todos sus libros.`)) return;
        // Llamada a la API de borrado que creamos (DELETE del USERS-IMPORTANTE, porque un usuario ordinario no puede)
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) {
            // Actualización optimista: Filtramos el array local para que el usuario desaparezca de la vista
            // sin tener que recargar toda la página.
            setUsers(users.filter(u => u._id !== id));
            alert("Usuario eliminado con éxito.");
        }
    };
    // --- RENDERIZADO (INTERFAZ) ---
    //  Pantalla de carga (mientras verificamos si es admin)
    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <p className="text-white tracking-[0.3em] text-[9px] md:text-[10px] uppercase animate-pulse">
                Verificando credenciales de acceso...
            </p>
        </div>
    );

    // FRONTED
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-20">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera */}
                <header className="mb-12 md:mb-20 border-l-2 border-white pl-5 md:pl-8">
                    <h1 className="text-3xl md:text-5xl font-serif italic mb-2">Administración</h1>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-gray-500 font-bold">
                        Gestión de Metamorfosis
                    </p>
                </header>
                <div className="grid grid-cols-1 gap-4">
                    {/* Contador de comunidad */}
                    <h2 className="text-[10px] md:text-[12px] uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-900 pb-4">
                        Usuarios Registrados ({users.length})
                    </h2>
                    {/* Bucle para mostrar cada usuario */}
                    {users.map((u) => (
                        <div key={u._id} className="bg-[#050505] border border-gray-900 p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-gray-500 transition-all gap-6">
                            {/* Bloque de Información Personal */}
                            <div className="flex flex-col gap-1 w-full md:w-auto">
                                <div className="flex items-center flex-wrap gap-3">
                                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                                        {u.name}
                                    </span>
                                    {/* Etiqueta especial solo si el usuario de la lista también es admin y pone Master */}
                                    {u.is_admin && (
                                        <span className="text-[6px] md:text-[7px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                                            MASTER ADMIN
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] md:text-[10px] text-gray-600 italic break-all">
                                    {u.email}
                                </span>
                            </div>
                            {/* Bloque de Datos Técnicos y Acciones */}
                            <div className="flex flex-row items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-12 border-t md:border-t-0 border-gray-900 pt-4 md:pt-0">
                                {/* Mostramos el ID de MongoDB para poder identificarlo */}
                                <div className="text-left md:text-right">
                                    <p className="text-[6px] md:text-[7px] text-gray-800 uppercase font-bold">Registro ID</p>
                                    <p className="text-[8px] md:text-[9px] font-mono text-gray-700">
                                        <span className="md:hidden">{u._id.slice(0, 8)}...</span>
                                        <span className="hidden md:inline">{u._id}</span>
                                    </p>
                                </div>
                                {/* BOTÓN DE ACCIÓN: (porque me he borrado a mi misma y la he liado)
                                    IMPORTANTE: u._id !== currentUser?.id evita que el admin se borre a sí mismo por error. 
                                */}
                                {u._id !== currentUser?.id && (
                                    <button
                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                        className="text-[8px] md:text-[9px] font-bold border border-red-900 text-red-900 px-4 md:px-6 py-2 hover:bg-red-900 hover:text-white transition-all uppercase tracking-tighter"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}