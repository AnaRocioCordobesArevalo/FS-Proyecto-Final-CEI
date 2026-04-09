//importamos la conexiones, los models y el server
import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
////PUT y DELETE, esta separado del GET y del POST



// Actualizar un libro ->  PUT /api/books/id
//Postman: poner la url/api/books/ id para que actualice 
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedBook = await Books.findByIdAndUpdate(
            id,
            { //Estructura de la base de datos de libros, es decir, el modelo
                tittle: body.tittle,
                category: body.category, // FK de categorias
                author: body.author,
            },
            { new: true }
        ).populate("category"); // devuelve el nombre de la categoría
        //Si no se puede encontrar el libro
        if (!updatedBook) {
            return NextResponse.json(
                { error: "Libro no encontrado" },
                { status: 404 } //Manejo de errores
            );
        }
        //En el caso de que no se pueda actualizar el libro
        return NextResponse.json(updatedBook);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}

// Borrar un libro -> DELETE /api/books/id
//En Postman: hay que poner la url/api/books/ id del libro que queremos eliminar 
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedBook = await Books.findByIdAndDelete(id); //Que encuentre la id y lo borre
        //En el caso que no encuentre el libro
        if (!deletedBook) {
            return NextResponse.json(
                { error: "Libro no encontrado" },
                { status: 404 } //Manejo de errores
            );
        }
        //Verificación de que el libro ha sido eliminado
        return NextResponse.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        //En el caso de error al borrar un libro
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}