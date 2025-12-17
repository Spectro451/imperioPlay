"use client";

import { Usuario } from "@/types/usuario";
import { Rol } from "@/types/enums";
import { FaBan, FaCheck, FaUserShield, FaUserTie } from "react-icons/fa";
import { useState } from "react";
import { editarUsuario } from "@/lib/usuario";

export default function EmpleadosList({
  empleados,
  token,
}: {
  empleados: Usuario[];
  token: string;
}) {
  const [localEmpleados, setLocalEmpleados] = useState(empleados);

  const getRolIcon = (rol: Rol) => {
    switch (rol) {
      case Rol.admin:
        return <FaUserShield className="text-red-500" />;
      case Rol.empleado:
        return <FaUserTie className="text-blue-500" />;
      default:
        return null;
    }
  };

  const handleCambiarRol = async (id: number, nuevoRol: Rol) => {
    if (nuevoRol !== Rol.empleado && nuevoRol !== Rol.admin) return;

    try {
      await editarUsuario(token, id, { rol: nuevoRol });
      setLocalEmpleados((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="p-3 text-left border">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Rol</th>
            <th className="p-3 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {localEmpleados.map((empleado) => (
            <tr key={empleado.id}>
              <td className="p-3 border">{empleado.nombre}</td>
              <td className="p-3 border">{empleado.correo}</td>
              <td className="p-3 border">
                <div className="flex items-center gap-2">
                  {getRolIcon(empleado.rol)}
                  <select
                    value={empleado.rol}
                    onChange={(e) =>
                      handleCambiarRol(empleado.id, e.target.value as Rol)
                    }
                    className="border rounded p-1"
                  >
                    <option value={Rol.empleado}>Empleado</option>
                    <option value={Rol.admin}>Admin</option>
                  </select>
                </div>
              </td>
              <td className="p-3 border">
                <div className="flex items-center gap-2">
                  {empleado.isActive ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaBan className="text-red-500" />
                  )}
                  <span>{empleado.isActive ? "Activo" : "Inactivo"}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
