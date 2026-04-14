import { NextResponse } from "next/server";

export async function serverErrorMiddleware() {
    return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
    );
}