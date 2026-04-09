import { connectDB } from "@/lib/mongoose";
import Exchange from "@/models/Exchanges";
import { NextResponse } from "next/server";

// Actualizar estado -> PUT /api/exchanges/id 
// Es importante poner en el Postman: la url/api/exchanges/id para que busque desde la id y actualice
export async function PUT(request, { params }) { //Es importante el request para que se hagan las peticiones
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedExchange = await Exchange.findByIdAndUpdate( //para que busque desde la id y que actualice
            id,
            { status: body.status }, // solo se actualiza el estado
            { new: true }
        )
            .populate("user_from", "name email")
            .populate("user_to", "name email")
            .populate("book_offered", "tittle author") //Estructura de la base de datos
            .populate("book_requested", "tittle author");
        // En el caso de que no encuentre el intercambio
        if (!updatedExchange) {
            return NextResponse.json(
                { error: "Intercambio no encontrado" },
                { status: 404 }
            );
        }
        //En el caso de que no actualice
        return NextResponse.json(updatedExchange);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 }
        );
    }
}

// Cancelar/borrar intercambio ->DELETE /api/exchanges/id
// Es importante poner en el Postman: la url/api/exchanges/id para que busque desde la id y borre
export async function DELETE(request, { params }) { //Es importante el request para que se hagan las peticiones y luego se borre
    try {
        await connectDB();
        const { id } = await params;
        const deletedExchange = await Exchange.findByIdAndDelete(id);

        if (!deletedExchange) {
            return NextResponse.json(
                { error: "Intercambio no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Intercambio eliminado correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 }
        );
    }
}