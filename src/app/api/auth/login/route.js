import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // <--- USAR JOSE

export async function POST(request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const user = await Users.findOne({ email: email.toLowerCase().trim() });
        if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

        // --- FIRMA DEL TOKEN CON JOSE ---
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const token = await new SignJWT({ 
            id: user._id.toString(), 
            email: user.email, 
            is_admin: user.is_admin 
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        return NextResponse.json({ 
            token, 
            user: { name: user.name, email: user.email, is_admin: user.is_admin } 
        });

    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}