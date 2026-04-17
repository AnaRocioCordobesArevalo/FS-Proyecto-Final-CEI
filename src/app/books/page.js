"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BooksGallery() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("/api/books");
                const data = await res.json();
                // Filtramos para asegurar que tenemos un array
                setBooks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error cargando libros:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                <p className="text-xl animate-pulse">Cargando biblioteca...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Libros Disponibles</h1>
                    <Link 
                        href="/add-book" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Publicar Libro
                    </Link>
                </div>

                {books.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow">
                        <p className="text-gray-500 text-lg">No hay libros publicados todavía.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                {/* Contenedor de la Imagen */}
                                <div className="h-64 bg-gray-200 relative">
                                    {book.image ? (
                                        <img 
                                            src={book.image} 
                                            alt={book.tittle} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <span className="text-sm italic">Sin portada</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                            {book.category?.name || "General"}
                                        </span>
                                    </div>
                                </div>

                                {/* Información del Libro */}
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-800 truncate mb-1" title={book.tittle}>
                                        {book.tittle}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-3">por {book.author}</p>
                                    
                                    <hr className="mb-3" />
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs text-gray-500">
                                            <p className="font-medium">Dueño:</p>
                                            <p className="truncate w-24">{book.owner?.name || "Anónimo"}</p>
                                        </div>
                                        <button 
                                            className="bg-green-500 text-white text-sm px-3 py-1.5 rounded hover:bg-green-600 transition"
                                            onClick={() => alert(`Interés enviado para: ${book.tittle}`)}
                                        >
                                            Me interesa
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