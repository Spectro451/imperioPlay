import { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import Footer from "@/components/footer/footer";
import ClienteNav from "@/components/navBar/clienteNavBar";
import { cookies } from "next/headers";
import EmpleadoNav from "@/components/navBar/empleadoNavBar";
import AdminNav from "@/components/navBar/adminNav";

export const metadata: Metadata = {
  title: "ImperioPlay",
  description: "Intercambia y compra juegos",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rol = cookieStore.get("rol")?.value;

  const getNavbar = () => {
    switch (rol) {
      case "admin":
        return <AdminNav />;
      case "empleado":
        return <EmpleadoNav />;
      case "cliente":
        return <ClienteNav />;
      default:
        return <ClienteNav />;
    }
  };
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <header className="relative w-full h-48">
          <Image
            src="/banner.jpg"
            alt="Banner"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority={true}
            loading="eager"
          />
        </header>
        {getNavbar()}
        <div className="flex-grow">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
