import { Rol } from "@/types/enums";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postUsuario(data: {
  nombre: string;
  correo: string;
  password: string;
  rol?: Rol;
}) {
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

export async function getall() {
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
