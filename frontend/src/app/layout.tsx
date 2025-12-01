import { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import Footer from "@/components/footer/footer";
import ClienteNav from "@/components/navBar/clienteNavBar";

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
        <ClienteNav></ClienteNav>
        <div className="flex-grow">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
