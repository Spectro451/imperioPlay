import FiltrosSidebar from "@/components/productos/filtros";
import ProductosGrid from "@/components/productos/gridProductos";
import Paginacion from "@/components/productos/paginacion";
import { getOfertas, getProductos } from "@/lib/producto";
import { Consola, estadoJuego, Orden, tipoProducto } from "@/types/enums";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;

  const filtros = {
    tipo: params.tipo as tipoProducto | undefined,
    consola: params.consola as Consola | undefined,
    orden: (params.orden as Orden) || Orden.ID_DESC,
    page: params.page ? Number(params.page) : 1,
    nombre: params.nombre as string | undefined,
    estado: params.estado as estadoJuego | undefined,
  };

  const resultadoData = await getProductos(filtros);
  const productos = resultadoData.productos;
  const totalPaginas = resultadoData.totalPaginas;

  return (
    <div className="flex min-h-screen">
      <aside className="w-50 md:w-70 border-1 p-2">
        <FiltrosSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1  flex flex-col">
        <ProductosGrid productos={productos} />

        {/* Paginación */}
        <Paginacion
          pageActual={filtros.page}
          totalPaginas={totalPaginas}
        ></Paginacion>
      </main>
    </div>
  );
}
