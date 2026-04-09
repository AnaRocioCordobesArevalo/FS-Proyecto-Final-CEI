//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

// Actualizar categoría -> PUT /api/categories/id 
//Importante: en Postman poner la url/api/categories/id, que queremos  actualizar
//PUT y DELETE, esta separado del GET y del PUT
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedCategory = await Category.findByIdAndUpdate(  //Actualizar desde la id -importante poner el id para poder encontrar la id que queremos eliminar
            //en este caso es actualizar la catogoría, ejemplo podemos cambiar fantasía por ciencia ficción
            id,
            { name: body.name },
            { new: true }
        );    //La tabla de categoria

        if (!updatedCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 } //Manejo de errores
            );
        }

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}

// Borrar categoría -> DELETE /api/categories/id- importante poner el id para poder encontrar la id que queremos eliminar 
//en este caso lo que queremos eliminar es la catogoria
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 } //Manejo de errores
            );
        }

        return NextResponse.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}