"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BooksGallery() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [resBooks, resCats] = await Promise.all([
                    fetch("/api/books"),
                    fetch("/api/categories")
                ]);

                const dataBooks = await resBooks.json();
                const dataCats = await resCats.json();

                setBooks(Array.isArray(dataBooks) ? dataBooks : []);
                setCategories(Array.isArray(dataCats) ? dataCats : []);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.tittle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "" || book.category?._id === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-gray-500 tracking-[0.3em] uppercase text-xs animate-pulse">Abriendo biblioteca...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-7xl mx-auto">

                {/* CABECERA ALINEADA A LA IZQUIERDA */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-l border-white pl-5">
                    <div>
                        
                        <h1 className="font-serif-logo text-3xl md:text-3xl mb-0.5 tracking-tight">Biblioteca</h1>
                        
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Explora y Colecciona</p>
                    </div>

                    {/* Botón Publicar más compacto */}
                    <Link
                        href="/add-book"
                        className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg active:scale-95 text-center"
                    >
                        + Publicar Libro
                    </Link>
                </div>

                {/* --- BARRA DE FILTROS MINIMALISTA --- */}
                <div className="flex flex-col md:flex-row gap-4 mb-16">
                    <div className="flex-1 group">
                        <input
                            type="text"
                            placeholder="BUSCAR TÍTULO O AUTOR..."
                            className="w-full bg-transparent border-b border-gray-800 p-4 outline-none focus:border-white transition-colors text-[11px] uppercase tracking-widest placeholder:text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:w-72">
                        <select
                            className="w-full bg-transparent border-b border-gray-800 p-4 outline-none focus:border-white transition-colors text-[11px] uppercase tracking-widest text-gray-400 cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="" className="bg-black text-white">TODAS LAS CATEGORÍAS</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id} className="bg-black text-white">{cat.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- GRID DE LIBROS --- */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-32 border border-gray-900 rounded-lg">
                        <p className="text-gray-600 tracking-[0.2em] uppercase text-xs">No se han encontrado ejemplares.</p>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
                            className="mt-6 text-white text-[10px] uppercase tracking-widest font-bold hover:underline"
                        >
                            Restablecer filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {filteredBooks.map((book) => (
                            <div key={book._id} className="group flex flex-col transition-all duration-500">

                                {/* Contenedor de Imagen Estilo Galería */}
                                <div className="aspect-[3/4] overflow-hidden relative bg-[#0a0a0a] rounded-sm mb-6 shadow-2xl">
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.tittle}
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-800 italic">
                                            Sin Portada
                                        </div>
                                    )}
                                    {/* Etiqueta flotante */}
                                    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md px-3 py-1 border border-gray-800 rounded-full">
                                        <span className="text-white text-[9px] font-bold uppercase tracking-widest">
                                            {book.category?.name || "General"}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido con Tipografía Serif */}
                                <div className="flex flex-col flex-1">
                                    <h2 className="font-serif-logo text-2xl text-white mb-1 group-hover:text-gray-300 transition-colors line-clamp-1">
                                        {book.tittle}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-medium mb-6">
                                        {book.author}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-900">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">Propiedad de</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 truncate w-24">
                                                {book.owner?.name || "Anónimo"}
                                            </span>
                                        </div>
                                        <button
                                            className="bg-white text-black px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                                            onClick={() => alert(`Propuesta enviada para: ${book.tittle}`)}
                                        >
                                            Intercambiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}