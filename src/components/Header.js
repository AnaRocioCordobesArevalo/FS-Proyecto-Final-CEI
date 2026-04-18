"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        setMenuOpen(false);
        // Borramos el rastro de sesión (puedes ajustar esto según tu lógica)
        localStorage.removeItem("token");
        router.push("/books");
    };

    return (
        <header className="bg-black text-white border-b border-gray-900 p-5 px-8 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                
                {/* --- LADO IZQUIERDO: Navegación Principal --- */}
                <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-gray-400">
                    <Link href="/books" className="hover:text-white transition-colors duration-200">
                        Inicio
                    </Link>
                    <Link href="/exchanges" className="hover:text-white transition-colors duration-200">
                        Intercambios
                    </Link>
                </div>

                {/* --- CENTRO: Título Principal con la nueva clase de fuente --- */}
                <Link href="/books" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                    <span className="font-serif-logo text-4xl md:text-5xl font-light tracking-tight leading-none text-white">
                        Metamorfosis
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mt-1 group-hover:text-indigo-400 transition-colors">
                        Book
                    </span>
                </Link>

                {/* --- LADO DERECHO: Cuenta y Botón de Acción --- */}
                <div className="flex items-center gap-6">
                    
                    {/* Menú Desplegable (Carrusel de opciones) */}
                    <div className="relative">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-white transition-colors"
                        >
                            Cuenta
                        </button>

                        {/* El desplegable estilo Dark Premium */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-5 w-52 bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
                                <Link 
                                    href="/profile" 
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 text-[11px] uppercase tracking-wider text-gray-400 hover:bg-white hover:text-black transition-all duration-200"
                                >
                                    Mi Perfil
                                </Link>
                                <hr className="border-gray-900 my-1" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-6 py-3 text-[11px] uppercase tracking-wider text-red-500 hover:bg-red-950/20 font-bold transition-all"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botón Estilo Oatmeal (Pill Button) */}
                    <Link 
                        href="/add-book" 
                        className="bg-white text-black px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-gray-200 transition-all shadow-md active:scale-95"
                    >
                        Empezar
                    </Link>
                </div>
            </div>
        </header>
    );
}