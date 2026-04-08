import { connectDB } from "@/lib/mongoose";
import Books from "@/models/Books";
import { NextResponse } from "next/server";

// Actualizar un libro → PUT 
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const body = await request.json();
        const updatedBook = await Books.findByIdAndUpdate(
            params.id,
            {
                tittle: body.tittle,
                category: body.category,
                author: body.author,
            },
            { new: true } // devuelve el documento ya actualizado
        );

        if (!updatedBook) {
            return NextResponse.json(
                { error: "Libro no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedBook);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 }
        );
    }
}

// Borrar un libro → DELETE 
export async function DELETE(request, { params }) {
    try {
        await connectDB(); //antes llamaba a DELETE() recursivamente
        const deletedBook = await Books.findByIdAndDelete(params.id);

        if (!deletedBook) {
            return NextResponse.json(
                { error: "Libro no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 }
        );
    }
}