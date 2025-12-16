import ConsolaForm from "@/components/productos/consolas/consolasForm/consolasForm";
import { getConsolaId } from "@/lib/consolas";
import { cookies } from "next/headers";

export default async function EditarConsola({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rol = cookieStore.get("rol")?.value;

  const consola = await getConsolaId(Number(id));

  if (!token || (rol !== "empleado" && rol !== "admin")) {
    return <div>No autorizado</div>;
  }

  if (!consola) {
    return <div>Consola no encontrada</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md w-full max-w-2xl">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-center">Editar Consola</h1>
        </div>
        <div className="p-6">
          <ConsolaForm token={token} consolaData={consola} modo="editar" />
        </div>
      </div>
    </div>
  );
}
