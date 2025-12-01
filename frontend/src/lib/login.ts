const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Login(correo: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  if (!res.ok) throw new Error("Usuario o contraseña incorrecto");
  const data = await res.json();

  document.cookie = `token=${data.access_token}; path=/;`;
  document.cookie = `rol=${data.rol}; path=/;`;
  return data;
}
