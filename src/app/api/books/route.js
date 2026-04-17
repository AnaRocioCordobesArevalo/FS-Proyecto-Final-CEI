//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose"; //Conexión con mongoose
import Books from "@/models/Books"; //Modelo de libros
import Category from "@/models/Category"; //Modelo de Categoria 
import Users from "@/models/Users"; //Modelo de usuarios 
import { NextResponse } from "next/server"; //La lógica

//Buscar el libro o los libros 
export async function GET() {
    try {
        await connectDB();
        const books = await Books.find({})
            .populate("category")
            .populate("owner", "name email");
        return NextResponse.json(books);
    } catch (error) { //manejo 
        return NextResponse.json(
            { error: "Error al cargar los libros" },
            { status: 500 }
        );
    }
}
//Publicar un libro 
export async function POST(request) { //peticiones 
    try {
        await connectDB();
        const body = await request.json();

        // Obtener el usuario del header (lo pone el middleware)
        const user = JSON.parse(request.headers.get("user")); //Peticion

        const newBook = await Books.create({
            tittle: body.tittle,  //Modelo 
            category: body.category,
            author: body.author,
            owner: user.id  // se identifique el usuario
        });
        const populated = await newBook.populate("category");
        return NextResponse.json(populated, { status: 201 });
    } catch (error) { //Manejo de errores 
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 }
        );
    }
}