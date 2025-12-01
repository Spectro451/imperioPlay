import Link from "next/link";

export default function NavJuegos() {
  return (
    <div className="relative w-full group">
      <Link
        href="/productos/juegos"
        className="block p-2 text-center hover:bg-green-500"
      >
        Juegos
      </Link>
      <div className="absolute hidden group-hover:block w-full bg-blue-500">
        <div className="relative submenu-group">
          <div className="p-2 text-center">Estado</div>
          <div className="absolute left-full top-0 hidden submenu-group-hover:block w-full bg-blue-500">
            <Link
              href="/productos/juegos?estado=nuevo"
              className="block p-2 hover:bg-green-500"
            >
              Nuevos
            </Link>
            <Link
              href="/productos/juegos?estado=usado"
              className="block p-2 hover:bg-green-500"
            >
              Usados
            </Link>
          </div>
        </div>

        <div className="relative submenu-group">
          <div className="p-2 text-center ">Consola</div>
          <div className="absolute left-full top-0 hidden submenu-group-hover:block w-full bg-blue-500">
            <Link
              href="/productos/juegos?consola=Xbox360"
              className="block p-2 hover:bg-green-500"
            >
              Xbox360
            </Link>
            <Link
              href="/productos/juegos?consola=XboxOne"
              className="block p-2 hover:bg-green-500"
            >
              XboxOne
            </Link>
            <Link
              href="/productos/juegos?consola=XboxSeries"
              className="block p-2 hover:bg-green-500"
            >
              XboxSeries
            </Link>
            <Link
              href="/productos/juegos?consola=Ps3"
              className="block p-2 hover:bg-green-500"
            >
              Ps3
            </Link>
            <Link
              href="/productos/juegos?consola=Ps4"
              className="block p-2 hover:bg-green-500"
            >
              Ps4
            </Link>
            <Link
              href="/productos/juegos?consola=Ps5"
              className="block p-2 hover:bg-green-500"
            >
              Ps5
            </Link>
            <Link
              href="/productos/juegos?consola=Switch"
              className="block p-2 hover:bg-green-500"
            >
              Switch
            </Link>
            <Link
              href="/productos/juegos?consola=Switch2"
              className="block p-2 hover:bg-green-500"
            >
              Switch2
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
