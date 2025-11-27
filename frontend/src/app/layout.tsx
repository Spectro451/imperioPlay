import { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ImperioPlay",
  description: "Intercambia y compra juegos",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <header className="relative w-full h-48">
          <Image
            src="/banner.jpg"
            alt="Banner"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
        </header>
        <nav className="flex justify-around items-center bg-blue-500">
          <Link href="/" className="block p-2 text-center w-full">
            Inicio
          </Link>

          <div className="relative w-full group ">
            <Link
              href="/productos"
              className="block p-2 text-center hover:bg-green-500"
            >
              Productos
            </Link>
            <div className="absolute hidden group-hover:block w-full bg-blue-500">
              <Link
                href="/productos/juegos"
                className="block p-2 text-center hover:bg-green-500"
              >
                Juegos
              </Link>
              <Link
                href="/productos/consolas"
                className="block p-2 text-center hover:bg-green-500"
              >
                Consolas
              </Link>
            </div>
          </div>

          <Link
            href="/productos/juegos"
            className="block p-2 text-center w-full"
          >
            Juegos
          </Link>

          <Link href="/consolas" className="block p-2 text-center w-full">
            Consolas
          </Link>

          <Link href="/ofertas" className="block p-2 text-center w-full">
            Ofertas
          </Link>
        </nav>
        <div className="flex-grow">{children}</div>

        <footer>@Derechos reservados</footer>
      </body>
    </html>
  );
}
