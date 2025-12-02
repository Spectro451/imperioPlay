import JuegoForm from "@/components/productos/juegosForm/juegosForm";
import { getJuegoId } from "@/lib/juegos";
import { cookies } from "next/headers";

export default async function EditarJuego({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rol = cookieStore.get("rol")?.value;

  const juego = await getJuegoId(Number(id));

  if (!token || (rol !== "empleado" && rol !== "admin")) {
    return <div>No autorizado</div>;
  }

  if (!juego) {
    return <div>Juego no encontrado</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md w-full max-w-2xl">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-center">Editar Juego</h1>
        </div>
        <div className="p-6">
          <JuegoForm token={token} juegoData={juego} modo="editar" />
        </div>
      </div>
    </div>
  );
}
