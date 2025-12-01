// app/productos/juegos/nuevo/page.tsx
import CrearJuegoForm from "@/components/productos/crear";
import { cookies } from "next/headers";

export default async function NuevoJuegoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rol = cookieStore.get("rol")?.value;

  // Solo empleado y admin pueden crear
  if (!token || (rol !== "empleado" && rol !== "admin")) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md w-full max-w-2xl">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-center">Crear Nuevo Juego</h1>
        </div>
        <div className="p-6">
          <CrearJuegoForm token={token} />
        </div>
      </div>
    </div>
  );
}
