import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Category from "@/models/Category";
import Users from "@/models/Users"; // Importante para buscar un dueño
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // 1. Buscamos a los usuarios para que sea el dueño
        const someUser = await Users.findOne({});
        if (!someUser) {
            return NextResponse.json({ error: "No hay usuarios en la DB" }, { status: 500 });
        }

        // Creamos los libros
        const newBook = await Books.create({
            tittle: body.tittle, 
            author: body.author,
            category: body.category,
            image: body.image,     
            description: body.description || "",
            owner: someUser._id, 
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