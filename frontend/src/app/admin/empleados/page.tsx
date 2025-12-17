import { cookies } from "next/headers";
import { Rol } from "@/types/enums";
import { getUsuarios } from "@/lib/usuario";
import EmpleadosList from "@/components/admin/tablaEmpleados";

export default async function EmpleadosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>No autorizado</div>;
  }

  const usuarios = await getUsuarios(token);

  const empleados = usuarios.filter(
    (usuario) => usuario.rol === Rol.empleado || usuario.rol === Rol.admin
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Empleados</h1>
      <EmpleadosList empleados={empleados} token={token} />
    </div>
  );
}
