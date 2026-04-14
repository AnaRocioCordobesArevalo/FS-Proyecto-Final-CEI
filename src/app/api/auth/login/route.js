import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Buscar el usuario por email
        const user = await Users.findOne({ email: body.email });
        if (!user) {
            return NextResponse.json(
                { error: "Email no registrado" },
                { status: 401 }
            );
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            return NextResponse.json(
                { error: "Contraseña incorrecta" },
                { status: 401 }
            );
        }

        // Crear el token JWT
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            message: "Login correcto",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al hacer login: ${error.message}` },
            { status: 500 }
        );
    }
}