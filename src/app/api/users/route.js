import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";
// He separado la parte del GET  y POST por una parte, pero, por otra he puesto el PUT y DELETE
// Buscar todos los usuarios
export async function GET() {
    try {
        await connectDB(); //para encontrar los usuarios y sería lo suyo hacer 2 cruds diferentes, pero, de momento no
        const users = await Users.find({});
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar los usuarios" }, //Manejo de errores
            { status: 500 }
        );
    }
}

// Crear un usuario
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newUser = await Users.create({  //Tabla de la base de datatos, es decir, la estructura
            name: body.name,
            email: body.email,
            password: body.password,
            is_admin: body.is_admin,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` }, //Manejo de errores
            { status: 500 }
        );
    }
}