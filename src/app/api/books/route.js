import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();

        // ← Leer el usuario que inyectó el middleware
        const userHeader = request.headers.get("user");
        if (!userHeader) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const payload = JSON.parse(userHeader); // ← aquí está el usuario logueado
        const body = await request.json();

        const newBook = await Books.create({
            tittle: body.tittle,
            author: body.author,
            category: body.category,
            image: body.image,
            description: body.description || "",
            owner: payload.id, 
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