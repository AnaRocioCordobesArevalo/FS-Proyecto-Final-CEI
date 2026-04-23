import { connectDB } from "@/lib/mongoose";//Los modelos de los libros de la base de datos
import Exchange from "@/models/Exchange";//Los modelos de los intercambios de la base de datos
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import Books from "@/models/Books";//Los modelos de los libros de la base de datos
import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP

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
                //En el caso de que no se encuentre el intercambio
                { error: "Intercambio no encontrado" },
                { status: 404 }
            );
        }
        //En el caso de que no actualice
        return NextResponse.json(updatedExchange);
    } catch (error) { //En el caso donde haya un error al actualizar
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
        const deletedExchange = await Exchange.findByIdAndDelete(id); //Busca la id y la borra

        if (!deletedExchange) {
            return NextResponse.json( //En el caso de que no se haya encontrado el intercambio
                { error: "Intercambio no encontrado" }, //Manejo de errores 
                { status: 404 }
            );
        }
        //En el caso de que se haya eliminado correctamente
        return NextResponse.json({ message: "Intercambio eliminado correctamente" });
    } catch (error) { //En el caso de que suceda un error al borrar 
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` }, //Manejo de errores 
            { status: 500 }
        );
    }
}