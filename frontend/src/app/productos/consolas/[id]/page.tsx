import Badges from "@/components/productos/consolas/badges";
import EditButton from "@/components/productos/consolas/editar/editarBoton";
import Fotos from "@/components/productos/juegos/fotos";
import Precios from "@/components/productos/juegos/precios";
import { getConsolaId } from "@/lib/consolas";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsolaDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const consola = await getConsolaId(Number(id));

    if (!consola || !consola.producto) {
      notFound();
    }

    const {
      producto,
      fotos,
      stock,
      generacion,
      estado,
      precio_base,
      precio_final,
      descuento_porcentaje,
      descuento_fijo,
    } = consola;

    return (
      <div className="container mx-auto p-3 max-w-6xl">
        <nav className="mb-3 text-sm flex justify-between items-center">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/productos" className="hover:underline">
                Productos
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium">{producto.nombre}</li>
          </ol>

          <EditButton consolaId={consola.id} />
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Fotos fotos={fotos} nombre={producto.nombre} />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
            </div>
            <Badges generacion={generacion} stock={stock} estado={estado} />
            <Precios
              precio_base={precio_base}
              precio_final={precio_final}
              descuento_porcentaje={descuento_porcentaje}
              descuento_fijo={descuento_fijo}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error cargando consola:", error);
    notFound();
  }
}
