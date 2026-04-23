import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP

export async function notFoundMiddleware() {
    return NextResponse.json(
        //En el caso de que no se encuentre la ruta 
        { error: "Ruta no encontrada" }, //Manejo de errores 
        { status: 404 }
    );
}