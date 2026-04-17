import { NextResponse } from "next/server";

// 1. Quita "/api/books" de esta lista para que sea pública temporalmente
const protectedRoutes = ["/api/exchanges", "/api/categories"]; 
const adminRoutes = ["/api/users"];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Si la ruta NO está en las listas, Next.js la dejará pasar sin pedir token
    if (!isProtectedRoute && !isAdminRoute) {
        return NextResponse.next();
    }

    // Aquí iría tu lógica de authMiddleware si la ruta fuera protegida...
    return NextResponse.next(); 
}

export const config = {
    matcher: ["/api/books/:path*", "/api/categories/:path*"]
};