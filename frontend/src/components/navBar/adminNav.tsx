import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <nav className="flex justify-around items-center bg-blue-500">
      <Link href="/" className="block p-2 text-center w-full">
        Inicio
      </Link>
      <div className="relative w-full group">
        <Link href="/productos" className="block p-2 text-center">
          Productos
        </Link>
        <div className="absolute hidden group-hover:block w-full bg-blue-500">
          <div className="relative submenu-group">
            <Link href="/productos/juegos" className="block p-2 text-center">
              Juegos
            </Link>
            <div className="absolute left-full top-0 hidden submenu-group-hover:block w-full bg-blue-500">
              <Link
                href="/productos/juegos/nuevo"
                className="block p-2 hover:bg-green-500"
              >
                Crear
              </Link>
            </div>
          </div>
          <div className="relative submenu-group">
            <Link href="/productos/consolas" className="block p-2 text-center">
              Consolas
            </Link>
            <div className="absolute left-full top-0 hidden submenu-group-hover:block w-full bg-blue-500">
              <Link
                href="/productos/consolas/nuevo"
                className="block p-2 hover:bg-green-500"
              >
                Crear
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Link href="/admin/usuarios" className="block p-2 text-center w-full">
        Usuarios
      </Link>
      <Link href="/admin/empleados" className="block p-2 text-center w-full">
        Empleados
      </Link>
      <Link href="/admin/reportes" className="block p-2 text-center w-full">
        Reportes
      </Link>
      <Link href="/admin/reservas" className="block p-2 text-center w-full">
        Reservas
      </Link>
      {token ? (
        <Link href="/perfil" className="block text-center w-full">
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
