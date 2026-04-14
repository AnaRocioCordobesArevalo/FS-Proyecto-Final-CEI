import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Verificar si el email ya existe
        const existingUser = await Users.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json(
                { error: "El email ya está registrado" },
                { status: 400 }
            );
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Crear el usuario con la contraseña encriptada
        const newUser = await Users.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            is_admin: false // por defecto no es admin
        });

        // No devolver la contraseña en la respuesta
        const { password, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al registrar: ${error.message}` },
            { status: 500 }
        );
    }
}