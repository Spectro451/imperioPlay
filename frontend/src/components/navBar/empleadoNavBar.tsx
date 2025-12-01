import Link from "next/link";

export default function EmpleadoNav() {
  return (
    <nav className="flex justify-around items-center bg-blue-500">
      <Link href="/" className="block p-2 text-center w-full">
        Inicio
      </Link>

      <Link href="/productos" className="block p-2 text-center w-full">
        Productos
      </Link>

      <Link href="/productos/juegos" className="block p-2 text-center w-full">
        Juegos
      </Link>

      <Link href="/consolas" className="block p-2 text-center w-full">
        Consolas
      </Link>

      <Link href="/ofertas" className="block p-2 text-center w-full">
        Ofertas
      </Link>
    </nav>
  );
}
