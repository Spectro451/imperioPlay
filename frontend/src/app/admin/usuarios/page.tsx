import { cookies } from "next/headers";

import { getUsuarios } from "@/lib/usuario";
import UsuariosList from "@/components/admin/tablaUsuarios";

export default async function UsuariosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rol = cookieStore.get("rol")?.value;

  if (!token || rol !== "admin") {
    return <div>No autorizado</div>;
  }

  const usuarios = await getUsuarios(token);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
      <UsuariosList usuarios={usuarios} token={token} />
    </div>
  );
}
