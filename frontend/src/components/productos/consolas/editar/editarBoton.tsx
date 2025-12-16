import { cookies } from "next/headers";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

interface Props {
  consolaId: number;
}

export default async function EditConsolaButton({ consolaId }: Props) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("rol")?.value;

  const isAuthorized = userRole === "admin" || userRole === "empleado";

  if (!isAuthorized) return null;

  return (
    <Link
      href={`/productos/consolas/${consolaId}/editar`}
      className="flex items-center justify-center w-8 h-8 rounded-lg"
      title="Editar consola"
    >
      <FaEdit className="w-5 h-5" />
    </Link>
  );
}
