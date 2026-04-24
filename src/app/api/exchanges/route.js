import { connectDB } from "@/lib/mongoose";
import Exchange from "@/models/Exchange";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const exchanges = await Exchange.find({})
            .populate("user_from", "name email")
            .populate("user_to", "name email")
            .populate("book_offered", "tittle author")
            .populate("book_requested", "tittle author");
        return NextResponse.json(exchanges);
    } catch (error) {
        return NextResponse.json({ error: "Error al cargar los intercambios" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();

        // ← Leer usuario logueado desde el middleware
        const userHeader = request.headers.get("user");
        if (!userHeader) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const payload = JSON.parse(userHeader);

        const body = await request.json();

        const newExchange = await Exchange.create({
            user_from: payload.id,        // ← siempre el usuario logueado
            user_to: body.user_to,
            book_offered: body.book_offered,
            book_requested: body.book_requested,
        });

        return NextResponse.json(newExchange, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Error al crear intercambio: ${error.message}` }, { status: 500 });
    }
}