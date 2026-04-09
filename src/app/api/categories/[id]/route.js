import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

// Actualizar categoría → PUT /api/categories/123
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: body.name },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json(
            { error: `Error al actualizar: ${error.message}` },
            { status: 500 }
        );
    }
}

// Borrar categoría → DELETE /api/categories/123
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al borrar: ${error.message}` },
            { status: 500 }
        );
    }
}