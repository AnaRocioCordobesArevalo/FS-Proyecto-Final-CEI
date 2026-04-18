"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-black">
                <Link href="/books" className="text-2xl font-black text-indigo-600 tracking-tighter">
                    BOOK<span className="text-gray-900">SWAP</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/books" className="font-medium hover:text-indigo-600">Inicio</Link>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 bg-gray-100 p-1.5 pr-4 rounded-full hover:bg-gray-200 transition"
                        >
                            <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                U
                            </div>
                            <span className="text-sm font-bold text-gray-700">Mi Cuenta</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50">
                                <Link 
                                    href="/profile" 
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                                >
                                    👤 Ver mi Perfil
                                </Link>
                                <hr />
                                <button 
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}