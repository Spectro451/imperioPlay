import { Metadata } from "next";

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
        <header>ImperioPlay</header>
        <nav>
          <p>Producto</p>
          <p>Producto</p>
          <p>Producto</p>
          <p>Producto</p>
          <p>Producto</p>
        </nav>
        {children}
        <footer>@Derechos recerbados</footer>
      </body>
    </html>
  );
}
