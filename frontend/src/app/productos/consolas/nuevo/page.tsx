import ConsolaForm from "@/components/productos/consolas/consolasForm/consolasForm";
import { cookies } from "next/headers";

export default async function NuevaConsolaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rol = cookieStore.get("rol")?.value;

  if (!token || (rol !== "empleado" && rol !== "admin")) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md w-full max-w-2xl">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-center">
            Crear Nueva Consola
          </h1>
        </div>
        <div className="p-6">
          <ConsolaForm token={token} modo="crear" />
        </div>
      </div>
    </div>
  );
}
