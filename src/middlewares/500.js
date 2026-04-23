import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP
//Middleware para capturar errores globales.
export async function serverErrorMiddleware() {
    return NextResponse.json(
        //En el caso de que haya un error interno en el servidor
        { error: "Error interno del servidor" },
        { status: 500 }
    );
}