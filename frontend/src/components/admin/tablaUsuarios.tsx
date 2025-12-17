"use client";

import { Usuario } from "@/types/usuario";
import { Rol } from "@/types/enums";
import {
  FaUser,
  FaUserShield,
  FaUserTie,
  FaBan,
  FaCheck,
} from "react-icons/fa";
import { useState } from "react";
import { editarUsuario } from "@/lib/usuario";

export default function UsuariosList({
  usuarios,
  token,
}: {
  usuarios: Usuario[];
  token: string;
}) {
  const [localUsuarios, setLocalUsuarios] = useState(usuarios);

  const getRolIcon = (rol: Rol) => {
    switch (rol) {
      case Rol.admin:
        return <FaUserShield className="text-red-500" />;
      case Rol.empleado:
        return <FaUserTie className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const handleCambiarRol = async (id: number, nuevoRol: Rol) => {
    try {
      await editarUsuario(token, id, { rol: nuevoRol });
      setLocalUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    }
  };

  const handleToggleEstado = async (id: number, isActive: boolean) => {
    try {
      await editarUsuario(token, id, { isActive: !isActive });
      setLocalUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u))
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="p-3 text-left border">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Rol</th>
            <th className="p-3 border">Estado</th>
            <th className="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {localUsuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="p-3 border">{usuario.nombre}</td>
              <td className="p-3 border">
                <div className="flex items-center gap-2">
                  {getRolIcon(usuario.rol)}
                  <select
                    value={usuario.rol}
                    onChange={(e) =>
                      handleCambiarRol(usuario.id, e.target.value as Rol)
                    }
                    className="border rounded p-1"
                  >
                    <option value={Rol.cliente}>Cliente</option>
                    <option value={Rol.empleado}>Empleado</option>
                    <option value={Rol.admin}>Admin</option>
                  </select>
                </div>
              </td>
              <td className="p-3 border">
                <div className="flex items-center gap-2">
                  {usuario.isActive ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaBan className="text-red-500" />
                  )}
                  <span>{usuario.isActive ? "Activo" : "Inactivo"}</span>
                </div>
              </td>
              <td className="p-3 border">
                <button
                  onClick={() =>
                    handleToggleEstado(usuario.id, usuario.isActive)
                  }
                  className={`px-3 py-1 rounded ${
                    usuario.isActive
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {usuario.isActive ? "Deshabilitar" : "Habilitar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
