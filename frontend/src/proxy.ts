import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  //verifico token
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //sacamos el rol
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userRole = payload.rol;

  //aqui le chanto que ruta uso(startWith) y el rol que requiere(userRole==='admin')

  //si cumple todo pasa
  return NextResponse.next();
}

//proteje de que minimo tengo un token en estas rutas
export const config = {
  matcher: ["/ventas/:path*", "/intercambio/:path*"],
};
