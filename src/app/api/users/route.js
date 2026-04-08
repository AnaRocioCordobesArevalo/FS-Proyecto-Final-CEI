import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";

// Buscar todos los usuarios
export async function GET() {
    try {
        await connectDB();
        const users = await Users.find({});
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar los usuarios" },
            { status: 500 }
        );
    }
}

// Crear un usuario
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newUser = await Users.create({
            name: body.name,
            email: body.email,
            password: body.password,
            is_admin: body.is_admin,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 }
        );
    }
}