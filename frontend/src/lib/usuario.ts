import { Rol } from "@/types/enums";
import { Usuario } from "@/types/usuario";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//crear usuario
export async function postUsuario(data: {
  nombre: string;
  correo: string;
  password: string;
  rol?: Rol;
}): Promise<Usuario> {
  const res = await fetch(`${API_URL}/usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando el usuario");
  return res.json();
}

//getUsuarios
export async function getUsuarios(token: string): Promise<Usuario[]> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
}

//getId
export async function getUsuarioId(
  token: string,
  id: number
): Promise<Usuario> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar usuario");
  return res.json();
}

//editar usuario
export async function editarUsuario(
  token: string,
  id: number,
  data: Partial<Usuario>
): Promise<Usuario> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar usuario");
  return res.json();
}

//borrar usuario
export async function deleteUsuario(
  token: string,
  id: number
): Promise<Usuario> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar usuario");
  return res.json();
}

//cambiar contraseña
export async function cambiarContraseña(
  token: string,
  id: number,
  data: { currentPassword: string; newPassword: string }
): Promise<Usuario> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/${id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al cambiar contraseña");
  return res.json();
}

//rehabilitar cuenta
export async function recuperarCuenta(data: {
  correo: string;
  password: string;
}): Promise<Usuario> {
  const res = await fetch(`${API_URL}/usuario/restore`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al reestablecer usuario");
  return res.json();
}

export async function getUsuarioActual(token: string): Promise<Usuario> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/yo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar perfil");
  return res.json();
}
