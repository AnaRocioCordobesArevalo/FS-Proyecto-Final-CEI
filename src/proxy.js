import { NextResponse } from "next/server";
import { authMiddleware, adminMiddleware } from "./middlewares/auth.js";
import { notFoundMiddleware } from "./middlewares/404.js";

// 1. DEFINIR LAS RUTAS (Esto es lo que falta o está mal ubicado)
const protectedRoutes = [
    "/api/exchanges",
    "/api/books",
    "/api/categories",
];

const adminRoutes = [
    "/api/users",
];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // 2. DEFINIR LAS CONSTANTES DE COMPROBACIÓN
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some(route =>
        pathname.startsWith(route)
    );

    // 3. LÓGICA DE REDIRECCIÓN / FILTRADO
    if (!isProtectedRoute && !isAdminRoute && pathname.startsWith("/api")) {
        return notFoundMiddleware();
    }

    if (isAdminRoute) {
        const authResult = await authMiddleware(request);
        // Si el auth falla (401), devolvemos el error de una vez
        if (authResult.status === 401) return authResult;
        // Si el auth pasa, verificamos si es admin
        return adminMiddleware(request);
    }

    if (isProtectedRoute) {
        return authMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/users/:path*",
        "/api/books/:path*",
        "/api/categories/:path*",
        "/api/exchanges/:path*",
    ]
};