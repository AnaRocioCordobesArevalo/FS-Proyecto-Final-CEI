import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";

// Actualizar un usuario → PUT /api/users/ en Postman buscar el id, obteniendo mediante el GET
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; // await params
        const body = await request.json();
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            {
                name: body.name,
                email: body.email,
                password: body.password,
                is_admin: body.is_admin,   //Estructura de la base de datos
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" }, //Manejo de errores
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` }, //Manejo de errores
            { status: 500 }
        );
    }
}

// Borrar un usuario → DELETE /api/users/ en Postman buscar el id, obteniendo mediante el GET
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; //await params 
        const deletedUser = await Users.findByIdAndDelete(id);  // para que busque con la ide y elimine

        if (!deletedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 } //Manejo de errores
            );
        }

        return NextResponse.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}