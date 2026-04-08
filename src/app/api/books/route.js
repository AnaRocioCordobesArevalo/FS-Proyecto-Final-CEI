import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import { NextResponse } from "next/server";

// Buscar todos los libros
export async function GET() {
    try {
        await connectDB();
        const books = await Books.find({});
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
            category: body.category,
            author: body.author,
        });
        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 }
        );
    }
}