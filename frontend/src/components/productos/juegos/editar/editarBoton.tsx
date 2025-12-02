import { cookies } from "next/headers";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

interface Props {
  juegoId: number;
}

export default async function EditJuegoButton({ juegoId }: Props) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("rol")?.value;

  const isAuthorized = userRole === "admin" || userRole === "empleado";

  if (!isAuthorized) return null;

  return (
    <Link
      href={`/productos/juegos/${juegoId}/editar`}
      className="flex items-center justify-center w-8 h-8 rounded-lg"
      title="Editar juego"
    >
      <FaEdit className="w-5 h-5" />
    </Link>
  );
}
