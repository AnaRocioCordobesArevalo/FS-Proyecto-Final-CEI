"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Importante para la navegación
import { useRouter } from "next/navigation";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    
    if (!mounted) {
        return <header className="bg-green-300 border-b h-16 w-full"></header>;
    }

    return (
        <header className="bg-green shadow-sm border-b w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* LADO IZQUIERDO: LOGO */}
                <div className="flex-shrink-0">
                    <Link href="/" className="text-2xl font-bold text-black-600">
                        Metamorfosis
                    </Link>
                </div>

                {/* LADO DERECHO: NAVEGACIÓN */}
                <nav className="flex items-center space-x-4">
                    <Link href="/books" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium">
                        Libros
                    </Link>

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        >
                            Perfil
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}