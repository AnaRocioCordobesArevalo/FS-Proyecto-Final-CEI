import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";

// Actualizar un usuario → PUT /api/users/123
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const body = await request.json();
        const updatedUser = await Users.findByIdAndUpdate(
            params.id,
            {
                name: body.name,
                email: body.email,
                password: body.password,
                is_admin: body.is_admin,
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 }
        );
    }
}

// Borrar un usuario → DELETE 
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const deletedUser = await Users.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 }
        );
    }
}