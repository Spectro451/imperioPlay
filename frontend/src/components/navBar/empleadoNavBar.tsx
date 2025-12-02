import { cookies } from "next/headers";
import Link from "next/link";
import NavJuegos from "./juegosNav";

export default async function EmpleadoNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <nav className="flex justify-around items-center bg-blue-500">
      <Link href="/" className="block p-2 text-center w-full">
        Inicio
      </Link>
      <Link href="/productos" className="block  text-center w-full">
        Productos
      </Link>
      <div className="relative w-full group">
        <Link href="/productos/juegos" className="block p-2 text-center ">
          Juegos
        </Link>
        <div className="absolute hidden group-hover:block w-full bg-blue-500">
          <Link
            href="/productos/juegos/nuevo"
            className="block p-2 text-center w-full"
          >
            Crear
          </Link>
        </div>
      </div>

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
