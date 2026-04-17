import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error("Error verificando token:", error.message);
        return null;
    }
}

export async function authMiddleware(request) {
    const payload = await verifyToken(request);
    if (!payload) {
        return NextResponse.json({ error: "Token inválido o requerido" }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(payload));
    return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function adminMiddleware(request) {
    const payload = await verifyToken(request);
    if (!payload || !payload.is_admin) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(payload));
    return NextResponse.next({ request: { headers: requestHeaders } });
}