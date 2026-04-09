import { connectDB } from "@/lib/mongoose";
import Exchange from "@/models/Exchange";
import Users from "@/models/Users";
import Books from "@/models/Books";
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
        return NextResponse.json(
            { error: "Error al cargar los intercambios" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newExchange = await Exchange.create({
            user_from: body.user_from,
            user_to: body.user_to,
            book_offered: body.book_offered,
            book_requested: body.book_requested,
        });
        return NextResponse.json(newExchange, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al crear intercambio: ${error.message}` },
            { status: 500 }
        );
    }
}