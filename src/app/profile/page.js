"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [booksCount, setBooksCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // 1. Pedir datos del usuario y sus estadísticas
                const res = await fetch("/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    // Suponiendo que la API devuelve el conteo
                    setBooksCount(data.stats.booksPublished); 
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="bg-black text-white p-20">Cargando...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif-logo mb-2">{user?.name || "Usuario"}</h1>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-10">Miembro de Metamorfosis</p>
                
                <div className="grid grid-cols-3 gap-10 border-t border-gray-900 pt-10">
                    <div>
                        <span className="block text-3xl font-light">{booksCount}</span>
                        <span className="text-[9px] text-gray-600 uppercase tracking-tighter">Publicaciones</span>
                    </div>
                    {/* ... resto de estadísticas ... */}
                </div>
            </div>
        </div>
    );
}