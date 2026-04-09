//importamos la conexiones, los models y el server
import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

// Buscar todos los libros con el nombre de la categoría
export async function GET() {
    try {
        await connectDB();
        const books = await Books.find({}).populate("category"); //Trae los datos de category, FK
        return NextResponse.json(books);
        //En el caso de que no carguen los libros
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar los libros" },
            { status: 500 } //Manejo de errores
        );
    }
}

// Crear un libro, PRIMERO hacerlo para luego ver la información que hay en el GET
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newBook = await Books.create({
            tittle: body.tittle,
            category: body.category, // se comunica con la tabla de categoria es decir, FK
            author: body.author,
        });
        // populate para devolver el nombre de la categoría en la respuesta
        const populated = await newBook.populate("category");
        return NextResponse.json(populated, { status: 201 });
    } catch (error) {  //En el caso de que no se guarde bien el libro
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 } //Manejo de errores 
        );
    }
}