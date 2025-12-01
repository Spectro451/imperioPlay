"use client";
import { useRouter } from "next/navigation";
interface Props {
  pageActual: number;
  totalPaginas: number;
}

export default function Paginacion({ pageActual, totalPaginas }: Props) {
  const router = useRouter();
  if (totalPaginas < 1) return null;

  const cambiarPagina = (nuevaPagina: number) => {
    router.push(`?page=${nuevaPagina}`);
  };
  return (
    <div className="flex justify-center items-center gap-2 p-4  border-t">
      <button
        disabled={pageActual === 1}
        onClick={() => cambiarPagina(pageActual - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="text-sm">
        Página {pageActual} de {totalPaginas}
      </span>

      <button
        onClick={() => cambiarPagina(pageActual + 1)}
        disabled={pageActual === totalPaginas}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
