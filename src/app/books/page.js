"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BooksGallery() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // --- NUEVOS ESTADOS PARA EL INTERCAMBIO ---
    const [modal, setModal] = useState(null);      // Libro que quiero solicitar
    const [myBooks, setMyBooks] = useState([]);    // Mis libros para ofrecer
    const [offering, setOffering] = useState(""); // ID del libro seleccionado para ofrecer
    const [sending, setSending] = useState(false);

    const loadData = async () => {
        try {
            const [resBooks, resCats, resUser] = await Promise.all([
                fetch("/api/books", { credentials: "include" }),
                fetch("/api/categories", { credentials: "include" }),
                fetch("/api/auth/me", { credentials: "include" })
            ]);

            const dataBooks = await resBooks.json();
            const dataCats = await resCats.json();

            if (resUser.ok) {
                const userData = await resUser.json();
                setUser(userData.user);
                
                // FILTRAR MIS LIBROS: Guardamos los libros que me pertenecen
                const myOwned = (Array.isArray(dataBooks) ? dataBooks : []).filter(
                    b => (b.owner?._id || b.owner) === userData.user._id
                );
                setMyBooks(myOwned);
            }

            setBooks(Array.isArray(dataBooks) ? dataBooks : []);
            setCategories(Array.isArray(dataCats) ? dataCats : []);

        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- LÓGICA DE ENVÍO DE INTERCAMBIO ---
    const handleExchange = async () => {
        if (!offering) return alert("Selecciona un libro para ofrecer");
        setSending(true);
        try {
            const res = await fetch("/api/exchanges", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_to: modal.owner._id,
                    book_offered: offering,
                    book_requested: modal._id,
                }),
            });
            if (res.ok) {
                setModal(null);
                setOffering("");
                alert("¡Solicitud de intercambio enviada!");
            } else {
                const err = await res.json();
                alert(err.error || "Error al enviar");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id, title) => {
        const confirmDelete = confirm(`¿Estás seguro de eliminar "${title}" de la biblioteca?`);
        if (!confirmDelete) return;
        try {
            const res = await fetch(`/api/books/${id}`, {
                method: "DELETE",
                credentials: "include", 
            });
            if (res.ok) {
                setBooks(books.filter(b => b._id !== id));
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    };

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
            <p className="text-gray-500 tracking-[0.3em] uppercase text-xs animate-pulse italic">Abriendo biblioteca...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
                
                {/* CABECERA (Igual a la tuya) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-l border-white pl-5">
                    <div>
                        <h1 className="font-serif-logo text-3xl md:text-3xl mb-0.5 tracking-tight italic">Biblioteca</h1>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Explora y Colecciona</p>
                    </div>
                    <Link href="/add-book" className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all text-center">
                        + Publicar Libro
                    </Link>
                </div>

                {/* FILTROS (Igual a los tuyos) */}
                <div className="flex flex-col md:flex-row gap-4 mb-16">
                    <input
                        type="text"
                        placeholder="BUSCAR TÍTULO O AUTOR..."
                        className="flex-1 bg-transparent border-b border-gray-800 p-4 outline-none focus:border-white transition-colors text-[11px] uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="md:w-72 bg-transparent border-b border-gray-800 p-4 outline-none focus:border-white transition-colors text-[11px] uppercase tracking-widest text-gray-400"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" className="bg-black text-white">TODAS LAS CATEGORÍAS</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id} className="bg-black text-white">{cat.name.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {/* GRID DE LIBROS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {filteredBooks.map((book) => (
                        <div key={book._id} className="group flex flex-col relative">
                            {/* BOTÓN ELIMINAR */}
                            {(user?.is_admin || user?._id === (book.owner?._id || book.owner)) && (
                                <button onClick={() => handleDelete(book._id, book.tittle)} className="absolute top-2 right-2 z-10 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 px-2 py-1 rounded text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all">
                                    Eliminar
                                </button>
                            )}

                            <div className="aspect-[3/4] overflow-hidden relative bg-[#0a0a0a] rounded-sm mb-6 shadow-2xl">
                                {book.image ? (
                                    <img src={book.image} alt={book.tittle} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-800 italic">Sin Portada</div>
                                )}
                            </div>

                            <div className="flex flex-col flex-1">
                                <h2 className="font-serif-logo text-2xl text-white mb-1 italic line-clamp-1">{book.tittle}</h2>
                                <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 mb-6 italic">{book.author}</p>
                                
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-900">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-600 uppercase mb-0.5">Propiedad de</span>
                                        <span className="text-[10px] font-bold text-gray-400 truncate w-24">{book.owner?.name || "Anónimo"}</span>
                                    </div>
                                    
                                    {/* BOTÓN INTERCAMBIAR ACTUALIZADO */}
                                    <button
                                        className="bg-white text-black px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                                        onClick={() => {
                                            if (user?._id === (book.owner?._id || book.owner)) return alert("Este libro es tuyo");
                                            if (!user) return alert("Inicia sesión para intercambiar");
                                            setModal(book);
                                            setOffering("");
                                        }}
                                    >
                                        Intercambiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- COMPONENTE MODAL --- */}
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-lg max-w-md w-full shadow-2xl">
                            <h2 className="font-serif-logo text-xl italic mb-2 text-white">Solicitar Intercambio</h2>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">
                                Estás pidiendo: <span className="text-white">{modal.tittle}</span>
                            </p>
                            
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2 font-black">Selecciona tu libro para ofrecer:</label>
                            <select 
                                className="w-full bg-black border border-gray-800 p-3 text-[11px] text-white uppercase tracking-widest mb-8 outline-none focus:border-white transition-colors"
                                value={offering}
                                onChange={(e) => setOffering(e.target.value)}
                            >
                                <option value="">-- MIS LIBROS --</option>
                                {myBooks.map(b => (
                                    <option key={b._id} value={b._id}>{b.tittle.toUpperCase()}</option>
                                ))}
                            </select>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setModal(null)}
                                    className="flex-1 px-4 py-3 border border-gray-800 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleExchange}
                                    disabled={sending}
                                    className="flex-1 px-4 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                                >
                                    {sending ? "Enviando..." : "Enviar Propuesta"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}