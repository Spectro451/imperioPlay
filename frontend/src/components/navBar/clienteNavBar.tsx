import Link from "next/link";
import { cookies } from "next/headers";
import NavJuegos from "./juegosNav";

export default async function ClienteNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <nav className="flex justify-around items-center bg-blue-500">
      <Link href="/" className="block  text-center w-full">
        Inicio
      </Link>

      <Link href="/productos" className="block  text-center w-full">
        Productos
      </Link>

      <NavJuegos />

      <Link href="/productos/consolas" className="block  text-center w-full">
        Consolas
      </Link>

      <Link href="/productos/ofertas" className="block  text-center w-full">
        Ofertas
      </Link>
      {token ? (
        <Link href="/perfil" className="block  text-center w-full">
          Mi Perfil
        </Link>
      ) : (
        <Link href="/auth/login" className="block text-center w-full">
          Login
        </Link>
      )}
    </nav>
  );
}
