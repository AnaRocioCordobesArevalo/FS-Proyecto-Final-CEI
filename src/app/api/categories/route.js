import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category"; 
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({});
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar las categorías" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newCategory = await Category.create({
            name: body.name  
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 }
        );
    }
}