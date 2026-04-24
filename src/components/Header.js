"use client"; //permite que se usar los hooks 
import { useState, useEffect, useRef } from "react"; // Hooks de React para manejar el estado y efectos secundarios
import Link from "next/link"; // Hook para redireccionar al usuario
import { useRouter, usePathname } from "next/navigation"; //Componente de optimización entre las páginas

export default function Header() {
    //ESTADOS
    const [isLoggedIn, setIsLoggedIn] = useState(false); //Si hay una sesión activa
    const [user, setUser] = useState(null); // Datos del usuario
    const [showDropdown, setShowDropdown] = useState(false); // Control del menú de "Cuenta"
    const router = useRouter();
    const pathname = usePathname(); // Detecta cambios de URL para re-verificar auth
    const userRef = useRef(null); 

    const checkAuth = async () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        // Extraer el token de las cookies del navegador
        if (token) {
            setIsLoggedIn(true);
            if (!userRef.current) {
                try {
                    const res = await fetch("/api/auth/me", {
                        credentials: "include",
                    });
                    if (res.ok) {
                        const data = await res.json();
                        userRef.current = data.user;
                    } //En el caso de que haya un error en la verificación del usuario
                } catch (error) {
                    console.error("Error verificando usuario:", error); //Manejo de errores 
                }
            }
        } else {
            userRef.current = null;
            setIsLoggedIn(false);
            setUser(null);
        }
    };
    //El disparador cada vez que el usuario cambia de página.
    useEffect(() => {
        checkAuth();
    }, [pathname]);
    //Para salir de la cuenta 
    const handleLogout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        localStorage.removeItem("token");
        userRef.current = null; 
        setIsLoggedIn(false);
        setUser(null);
        setShowDropdown(false);
        router.push("/login");
        router.refresh();
    };
    //FRONTED
    return (
        <header className="bg-black py-6 px-10 flex justify-between items-center border-b border-gray-900 sticky top-0 z-[100]">
            <Link href="/" className="font-serif-logo text-2xl text-white">
                Metamorfosis.
            </Link>
            {/* NAVEGACIÓN DERECHA */}
            <div className="flex items-center gap-8">
                {isLoggedIn && (
                    <Link href="/books" className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors">
                        Biblioteca
                    </Link>
                )}

                {isLoggedIn && user?.is_admin && (
                    <Link href="/admin" className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold hover:text-white transition-colors">
                        Panel Admin
                    </Link>
                )}

                {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-[10px] uppercase tracking-[0.3em] text-white font-bold hover:opacity-70 transition-opacity"
                            >
                                Cuenta
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-4 w-48 bg-[#0a0a0a] border border-gray-900 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <Link
                                        href="/profile"
                                        onClick={() => setShowDropdown(false)}
                                        className="block px-6 py-4 text-[9px] uppercase tracking-widest text-gray-400 hover:bg-white hover:text-black transition-all"
                                    >
                                        Mi Perfil
                                    </Link>

                                    {user?.is_admin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setShowDropdown(false)}
                                            className="block px-6 py-4 text-[9px] uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all border-t border-gray-900"
                                        >
                                            Admin Usuarios
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-6 py-4 text-[9px] uppercase tracking-widest text-gray-500 hover:bg-red-500 hover:text-white transition-all border-t border-gray-900"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/add-book" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                            Publicar
                        </Link>
                    </div>
                ) : (
                    <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                        Entrar
                    </Link>
                )}
            </div>
        </header>
    );
}