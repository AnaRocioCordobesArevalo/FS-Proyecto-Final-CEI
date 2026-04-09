import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import { NextResponse } from "next/server";

// Buscar todos los libros con el nombre de la categoría
export async function GET() {
    try {
        await connectDB();
        const books = await Books.find({}).populate("category"); // ✅ trae los datos de Category
        return NextResponse.json(books);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar los libros" },
            { status: 500 }
        );
    }
}

// Crear un libro
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newBook = await Books.create({
            tittle: body.tittle,
            category: body.category, // ✅ aquí va el _id de la categoría
            author: body.author,
        });
        // populate para devolver el nombre de la categoría en la respuesta
        const populated = await newBook.populate("category");
        return NextResponse.json(populated, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 }
        );
    }
}