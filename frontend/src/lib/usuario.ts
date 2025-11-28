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
export async function getUsuarios(): Promise<Usuario[]> {
  const token = localStorage.getItem("token");
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
export async function getUsuarioId(id: number): Promise<Usuario> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/usuario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar usuario");
  return res.json();
}

export async function editarUsuario(
  id: number,
  data: Partial<Usuario>
): Promise<Usuario> {
  const token = localStorage.getItem("token");
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

export async function deleteUsuario(id: number): Promise<Usuario> {
  const token = localStorage.getItem("token");
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

export async function cambiarContraseña(
  id: number,
  data: { currentPassword: string; password: string }
): Promise<Usuario> {
  const token = localStorage.getItem("token");
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
