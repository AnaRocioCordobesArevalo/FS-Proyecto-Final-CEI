import { NextResponse } from "next/server";
import { authMiddleware, adminMiddleware } from "./middlewares/auth.js";
import { notFoundMiddleware } from "./middlewares/404.js";

// Rutas accesibles por cualquier usuario logueado
const protectedRoutes = ["/api/exchanges", "/api/categories", "/api/books"];
// Rutas exclusivas para administradores
const adminRoutes = ["/api/users"];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // --- BLOQUE CORS ---
    //Definimos qué dominios, métodos y cabeceras permitimos.
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // El navegador envía un OPTIONS antes de un POST/PUT con headers personalizados.
    if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    }
    // Identificamos el tipo de ruta según las listas
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    let response;

    // Lógica de rutas 
    if (!isProtectedRoute && !isAdminRoute && pathname.startsWith("/api")) {
        // Si la ruta empieza con /api pero no está en nuestras listas, lanzamos 404
        response = notFoundMiddleware();
    } else if (isAdminRoute) {
        const authResult = await authMiddleware(request);
        if (authResult.status === 401) return authResult;
        response = await adminMiddleware(request);
    } else if (isProtectedRoute) {
        response = await authMiddleware(request);
    } else {
        response = NextResponse.next();
    }

    // 3. Inyectar headers de CORS a la respuesta final
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}
// Configuración del matcher 
export const config = {
    matcher: [
        "/api/users/:path*",
        "/api/books/:path*",
        "/api/categories/:path*",
        "/api/exchanges/:path*",
    ]
};