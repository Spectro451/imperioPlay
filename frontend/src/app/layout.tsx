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
      <body>
        <header className="relative w-full h-48">
          <Image
            src="/banner.jpg"
            alt="Banner"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
        </header>
        <nav className="flex justify-around items-center bg-blue-500">
          <Link href="/" className="block p-2 text-white text-center w-full">
            Inicio
          </Link>

          <div className="relative w-full">
            <Link
              href="/productos"
              className="block p-2 text-white text-center "
            >
              Productos
            </Link>
          </div>

          <Link
            href="/juegos"
            className="block p-2 text-white text-center w-full"
          >
            Juegos
          </Link>

          <Link
            href="/consolas"
            className="block p-2 text-white text-center w-full"
          >
            Consolas
          </Link>

          <Link
            href="/ofertas"
            className="block p-2 text-white text-center w-full"
          >
            Ofertas
          </Link>
        </nav>

        {children}
        <footer>@Derechos recerbados</footer>
      </body>
    </html>
  );
}
