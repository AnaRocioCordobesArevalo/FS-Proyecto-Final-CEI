"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Importamos usePathname

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // Esto detecta cada vez que cambias de página

    const checkAuth = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        setIsLoggedIn(!!token);
    };

    // Comprobar cada vez que cambia la ruta
    useEffect(() => {
        checkAuth();
    }, [pathname]);

    // Comprobar al montar el componente
    useEffect(() => {
        checkAuth();
        
        // Opcional: un pequeño intervalo por si el router.push falla en refrescar
        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowDropdown(false);
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="bg-black py-6 px-10 flex justify-between items-center border-b border-gray-900 sticky top-0 z-[100]">
            <Link href="/" className="font-serif-logo text-2xl text-white">
                Metamorfosis.
            </Link>

            <div className="flex items-center gap-8">
                {/* BIBLIOTECA: Solo visible si hay sesión */}
                {isLoggedIn && (
                    <Link href="/books" className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors">
                        Biblioteca
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
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-6 py-4 text-[9px] uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all border-t border-gray-900"
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