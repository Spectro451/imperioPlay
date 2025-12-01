import { cookies } from "next/headers";
import { getUsuarioActual } from "@/lib/usuario";
import CambiarPassForm from "@/components/usuario/cambiarContra";

export default async function CambiarPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>No autorizado</div>;
  }

  const usuario = await getUsuarioActual(token);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md w-full max-w-md">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-center">Cambiar Contraseña</h1>
        </div>
        <div className="p-6">
          <CambiarPassForm usuario={usuario} token={token} />
        </div>
      </div>
    </div>
  );
}
