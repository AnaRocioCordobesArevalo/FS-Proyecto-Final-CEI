"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [newBook, setNewBook] = useState({
        tittle: "",
        author: "",
        category: ""
    });
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/books", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error("Error al cargar libros:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newBook)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setShowForm(false);
            setNewBook({ tittle: "", author: "", category: "" });
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleExchange = (book) => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }
        router.push(`/exchanges/new?book=${book._id}`);
    };

    // Filtrar libros por búsqueda y categoría
    const filteredBooks = books.filter(book => {
        const matchSearch =
            book.tittle.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            selectedCategory === "" ||
            book.category?._id === selectedCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* CABECERA */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Libros disponibles</h1>
                {isLoggedIn && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                    >
                        {showForm ? "Cancelar" : "+ Publicar libro"}
                    </button>
                )}
            </div>

            {/* FORMULARIO PUBLICAR */}
            {showForm && (
                <div className="bg-gray-50 border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Publicar nuevo libro</h2>
                    {error && (
                        <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{error}</p>
                    )}
                    <form onSubmit={handlePublish} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
                            <input
                                type="text"
                                value={newBook.tittle}
                                onChange={(e) => setNewBook({ ...newBook, tittle: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Autor</label>
                            <input
                                type="text"
                                value={newBook.author}
                                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
                            <select
                                value={newBook.category}
                                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-3">
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                            >
                                Publicar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* FILTROS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Buscar por título o autor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-1/4 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* GRID DE LIBROS */}
            {filteredBooks.length === 0 ? (
                <p className="text-center text-gray-400 py-16">No hay libros disponibles</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <div key={book._id} className="border rounded-lg p-5 hover:shadow-md transition bg-white">
                            <div className="mb-4">
                                <span className="text-xs text-gray-400 uppercase tracking-wide">
                                    {book.category?.name || "Sin categoría"}
                                </span>
                                <h3 className="text-base font-semibold text-gray-800 mt-1">{book.tittle}</h3>
                                <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Publicado por: {book.owner?.name || "Usuario"}
                                </p>
                            </div>
                            <button
                                onClick={() => handleExchange(book)}
                                className="w-full border border-black text-black text-sm py-2 rounded-md hover:bg-black hover:text-white transition"
                            >
                                Solicitar intercambio
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}