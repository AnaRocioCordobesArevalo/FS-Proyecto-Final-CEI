"use client"; //permite que se usar los hooks 
import { useState, useEffect } from "react"; // Hooks de React para manejar el estado y efectos secundarios
import Link from "next/link"; //Componente de optimización entre las páginas

export default function BooksGallery() {
    //ESTADOS DE DATOS
    const [books, setBooks] = useState([]); // Lista completa de libros desde la API
    const [categories, setCategories] = useState([]); // Categorías disponibles para el filtro
    const [loading, setLoading] = useState(true); // Control de la pantalla de carga
    const [user, setUser] = useState(null); // Estado para identificar al admin
    //ESTADOS DE FILTRADO
    const [searchTerm, setSearchTerm] = useState(""); // Texto de búsqueda (título o autor)
    const [selectedCategory, setSelectedCategory] = useState(""); // ID de categoría seleccionada
    const loadData = async () => {
        try {
            const [resBooks, resCats, resUser] = await Promise.all([
                fetch("/api/books"),//Cargamos la API de libros
                fetch("/api/categories"), //Cargamos la API de categorias 
                fetch("/api/auth/me") // Cargamos los datos del usuario actual
            ]);
            const dataBooks = await resBooks.json();
            const dataCats = await resCats.json();
            //Si el usuario está autentificado, se guarda en su perfil
            if (resUser.ok) {
                const userData = await resUser.json();
                setUser(userData.user);
            }
            //Se verifica que los datos sean un arrays antes de que se guarden
            setBooks(Array.isArray(dataBooks) ? dataBooks : []);
            setCategories(Array.isArray(dataCats) ? dataCats : []);
        } catch (error) { //En el caso de que no se puedan cargar los datos
            console.error("Error cargando datos:", error); //Manejo de errores 
        } finally {
            setLoading(false); //Se finaliza el estado de carga independientemente 
        }
    };
    //Se dispara la carga de datos al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    // FUNCIÓN DE ELIMINACIÓN
    const handleDelete = async (id, title) => {//En el caso de que queramos eliminar un libro de la página web
        const confirmDelete = confirm(`¿Estás seguro de eliminar "${title}" de la biblioteca?`);
        if (!confirmDelete) return;
        try {
            const res = await fetch(`/api/books/${id}`, {
                method: "DELETE", //llamamos al metodo de DELETE de la API de libros (books)
            });
            if (res.ok) {
                // Filtramos el estado local para que desaparezca visualmente
                setBooks(books.filter(b => b._id !== id));
            } else {
                const errorData = await res.json();
                //En el caso de que no se pueda eliminar el libro
                alert(errorData.error || "No se pudo eliminar el libro");
            }
        } catch (error) {
            console.error("Error al borrar:", error); //Manejo de errores 
        }
    };
    //EL FILTRO
    //Se filtran la lista de libros en base a la búsqueda de texto y la categoría seleccionada
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
    //EL FRONTED 
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
                {/* CABECERA */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-l border-white pl-5">
                    <div>
                        <h1 className="font-serif-logo text-3xl md:text-3xl mb-0.5 tracking-tight italic">Biblioteca</h1>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Explora y Colecciona</p>
                    </div>
                    <Link
                        href="/add-book"
                        className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg active:scale-95 text-center"
                    >
                        + Publicar Libro
                    </Link>
                </div>
                {/* FILTROS: Buscador y el Select para seleccionar las categorias  */}
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
                {/*CONTENIDO PRINCIPAL:
                Son los Grids de libros, donde aparece la categoria y en la parte inferior el dueño del libro*/}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-32 border border-gray-900 rounded-lg">
                        <p className="text-gray-600 tracking-[0.2em] uppercase text-xs italic">No se han encontrado ejemplares.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {filteredBooks.map((book) => (
                            <div key={book._id} className="group flex flex-col transition-all duration-500 relative">
                                
                                {/* BOTÓN ELIMINAR (Solo para ADMIN o MASTER) */}
                                {(user?.is_admin || user?._id === book.owner?._id) && (
                                    <button 
                                        onClick={() => handleDelete(book._id, book.tittle)}
                                        className="absolute top-2 right-2 z-10 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        Eliminar
                                    </button>
                                )}
                                <div className="aspect-[3/4] overflow-hidden relative bg-[#0a0a0a] rounded-sm mb-6 shadow-2xl">
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.tittle}
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-800 italic">Sin Portada</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md px-3 py-1 border border-gray-800 rounded-full">
                                        <span className="text-white text-[9px] font-bold uppercase tracking-widest">
                                            {book.category?.name || "General"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <h2 className="font-serif-logo text-2xl text-white mb-1 group-hover:text-gray-300 transition-colors line-clamp-1 italic">
                                        {book.tittle}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-medium mb-6 italic">
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