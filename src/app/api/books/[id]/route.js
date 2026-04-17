//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

//Tenemos separados los GET Y POST y tenemos el  PUT junto el DELETE.


//Para Actualizar los libros
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Obtener el usuario del header
        const user = JSON.parse(request.headers.get("user"));

        // Buscar el libro
        const book = await Books.findById(id);
        if (!book) { //En el caso de que no se encuentre el libro 
            return NextResponse.json(
                { error: "Libro no encontrado" },
                { status: 404 }
            );
        }
        // Verificar que sea el dueño o admin
        if (book.owner.toString() !== user.id && !user.is_admin) {
            return NextResponse.json( //Manejo de errores y lo que devuelve
                { error: "No autorizado - No eres el dueño del libro" },
                { status: 403 }
            );
        }

        const updatedBook = await Books.findByIdAndUpdate(
            id,
            {
                tittle: body.tittle,
                category: body.category, //modelo
                author: body.author,
            },
            { new: true }
        ).populate("category");
        //En el caso de que no se actualice 
        return NextResponse.json(updatedBook);
    } catch (error) { //Manejo de errres 
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        // Obtener el usuario del header
        const user = JSON.parse(request.headers.get("user"));

        // Buscar el libro
        const book = await Books.findById(id);
        if (!book) {
            return NextResponse.json( //Manejo de errores 
                { error: "Libro no encontrado" },
                { status: 404 }
            );
        }

        // Verificar que sea el dueño o admin
        if (book.owner.toString() !== user.id && !user.is_admin) {
            return NextResponse.json( //Manejo de error
                { error: "No autorizado - No eres el dueño del libro" },
                { status: 403 }
            );
        }

        await Books.findByIdAndDelete(id);
        return NextResponse.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        return NextResponse.json( //Manejo de error 
            { error: `Error al borrar: ${error.message}` },
            { status: 500 }
        );
    }
}