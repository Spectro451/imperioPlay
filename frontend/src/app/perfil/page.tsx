import { cookies } from "next/headers";
import { getUsuarioActual } from "@/lib/usuario";
import Link from "next/link";
import DeleteButton from "@/components/usuario/borrarUsuario";
import LogOut from "@/components/usuario/logout";

export default async function PerfilPage() {
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
          <h1 className="text-2xl font-bold text-center">Mi Perfil</h1>
        </div>

        {/* Información */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex gap-4 items-center">
                <span className="font-bold text-xl">Nombre:</span>
                <p className="">{usuario.nombre}</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="font-bold text-xl">Correo:</span>
                <p className="">{usuario.correo}</p>
              </div>
              <div className="flex gap-13 items-center">
                <span className="font-bold text-xl">Rol:</span>
                <p className="">{usuario.rol}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              href="/perfil/editar"
              className="block border rounded p-3 text-center "
            >
              Editar Perfil
            </Link>
            <Link
              href="/perfil/cambiarPass"
              className="block border rounded p-3 text-center "
            >
              Cambiar Contraseña
            </Link>

            <LogOut />
            <DeleteButton userId={usuario.id} token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
