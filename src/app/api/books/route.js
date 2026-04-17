import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Users from "@/models/Users"; // Importante para buscar un dueño
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // 1. Buscamos CUALQUIER usuario para que sea el dueño (evita error de validación)
        const someUser = await Users.findOne({});
        if (!someUser) {
            return NextResponse.json({ error: "No hay usuarios en la DB para asignar el libro" }, { status: 500 });
        }

        // 2. Creamos el libro
        const newBook = await Books.create({
            tittle: body.tittle, // Recuerda: doble 't' según tu modelo
            author: body.author,
            category: body.category,
            description: body.description || "",
            owner: someUser._id, // Asignamos el ID del usuario que encontramos
            status: "disponible"
        });

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Error al guardar: ${error.message}` }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();
    const books = await Books.find({}).populate("category").populate("owner", "name");
    return NextResponse.json(books);
}