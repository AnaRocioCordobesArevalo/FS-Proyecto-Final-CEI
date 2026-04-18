"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const resUser = await fetch("/api/users");
                const users = await resUser.json();
                const currentUser = users[0];
                setUser(currentUser);

                const resBooks = await fetch("/api/books");
                const allBooks = await resBooks.json();
                const filteredBooks = allBooks.filter(b => b.owner?._id === currentUser._id);
                setMyBooks(filteredBooks);
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-gray-500 tracking-[0.3em] uppercase text-xs animate-pulse">Cargando perfil...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-6xl mx-auto">

                {/* CABECERA ESTILO METAMORFOSIS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-gray-900 pb-8">
                    <div className="flex items-center gap-6">
                        {/* Avatar más pequeño (h-16 w-16 en lugar de h-24) */}
                        <div className="h-16 w-16 bg-white text-black rounded-full flex items-center justify-center text-xl font-light shadow-xl">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            {/* Nombre más pequeño (text-4xl en lugar de 6xl) */}
                            <h1 className="font-serif-logo text-3xl md:text-4xl mb-0.5 tracking-tight text-white">
                                {user?.name}
                            </h1>
                            {/* Email con letra mini */}
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Botón Publicar más compacto */}
                    <Link href="/add-book" className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg">
                        Publicar Libro
                    </Link>
                </div>

                {/* ESTADÍSTICAS EN 2 COLUMNAS */}
                <div className="grid grid-cols-2 gap-px bg-gray-900 border border-gray-900 rounded-lg overflow-hidden mb-20 shadow-2xl">
                    <div className="bg-[#0a0a0a] p-10 text-center">
                        <p className="text-4xl font-light text-white mb-2">{myBooks.length}</p>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Libros compartidos</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-10 text-center">
                        <p className="text-4xl font-light text-white mb-2">5</p>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Intercambios realizados</p>
                    </div>
                </div>

                {/* SECCIÓN DE MIS LIBROS */}
                <div className="mb-20">
                    <div className="text-left mb-12 border-l-2 border-white pl-6">
                        <h2 className="font-serif-logo text-4xl md:text-3xl mb-1">Mis Publicaciones</h2>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Biblioteca Personal</p>
                    </div>

                    {myBooks.length === 0 ? (
                        <div className="bg-[#0a0a0a] border border-gray-900 p-20 rounded-lg text-center">
                            <p className="text-gray-600 tracking-[0.2em] uppercase text-xs">Aún no has compartido historias.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {myBooks.map((book) => (
                                <div key={book._id} className="group bg-[#0a0a0a] border border-gray-900 rounded-lg overflow-hidden flex flex-col hover:border-gray-700 transition-all">
                                    <div className="h-64 bg-gray-900 relative overflow-hidden">
                                        {book.image ? (
                                            <img src={book.image} alt={book.tittle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-[5px] uppercase tracking-widest italic">Sin Imagen</div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[9px] font-bold text-white uppercase tracking-widest">
                                            {book.category?.name || "General"}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1">
                                        <h3 className="font-serif-logo text-2xl text-white mb-1">{book.tittle}</h3>
                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 mb-6">{book.author}</p>

                                        <div className="flex gap-4">
                                            <button className="flex-1 bg-transparent border border-gray-800 text-gray-400 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                                Editar
                                            </button>
                                            <button className="flex-1 bg-transparent border border-red-900/30 text-red-900 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}