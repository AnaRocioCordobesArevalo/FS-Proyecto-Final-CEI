import { NextResponse } from "next/server";

export async function notFoundMiddleware() {
    return NextResponse.json(
        { error: "Ruta no encontrada" },
        { status: 404 }
    );
}