import { connectDB } from "@/lib/mongoose";//Los modelos de los libros de la base de datos
import Exchange from "@/models/Exchange";//Los modelos de los intercambios de la base de datos
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import Books from "@/models/Books";//Los modelos de los libros de la base de datos
import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP


// Actualizar estado -> PUT /api/exchanges/id 
export async function PUT(request, { params }) { 
    try {
        await connectDB();
        const { id } = await params; // Esperamos los parámetros 
        const body = await request.json(); // Leemos el cuerpo de la petición
        // Buscamos por ID y actualizamos solo el campo status
        const updatedExchange = await Exchange.findByIdAndUpdate(  //Para que busque  por la id
            id, 
            { status: body.status }, 
            { new: true }
        )
            .populate("user_from", "name email")
            .populate("user_to", "name email")   // El modelo de la tabla
            .populate("book_offered", "tittle author") 
            .populate("book_requested", "tittle author");
        //En el caso en el que no encontremos el intercambio
        if (!updatedExchange) {
            return NextResponse.json(
                { error: "Intercambio no encontrado" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedExchange);
    } catch (error) { 
        return NextResponse.json(
            //En el caso de que haya un error al actualizar
            { error: `Error al actualizar: ${error.message}` }, //Manejo de errores 
            { status: 500 }
        );
    }
}

// PATCH - Actualiza solo campos específicos
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedExchange = await Exchange.findByIdAndUpdate( //Para que busque  por la id
            id,
            { status: body.status },
            { new: true }
        )
            .populate("user_from", "name email") // El modelo de la tabla
            .populate("user_to", "name email")
            .populate("book_offered", "title author")
            .populate("book_requested", "title author");
        if (!updatedExchange) {
            return NextResponse.json(
                //En el caso de que el intercambio no se ha encontrado 
                { error: "Intercambio no encontrado" }, //Manejo de errores 
                { status: 404 }
            );
        }
        return NextResponse.json(updatedExchange);
    } catch (error) { //En el caso de que hay un error al actualizar 
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` }, //Manejo de errores
            { status: 500 }
        );
    }
}
// Cancelar/borrar intercambio -> DELETE /api/exchanges/id
export async function DELETE(request, { params }) { 
    try {
        await connectDB();
        const { id } = await params;
        const deletedExchange = await Exchange.findByIdAndDelete(id);  //Se busca la id y luego se borra
        if (!deletedExchange) {
            return NextResponse.json(
                //En el caso que no se haya encontrado el intercambio
                { error: "Intercambio no encontrado" },
                { status: 404 } //Manejo de errores 
            );
        }
        return NextResponse.json({ message: "Intercambio eliminado correctamente" });
    } catch (error) { 
        return NextResponse.json(
            //En el caso de que no se pueda borrar 
            { error: `Error al borrar: ${error.message}` },
            { status: 500 } //Manejo de errores 
        );
    }
}