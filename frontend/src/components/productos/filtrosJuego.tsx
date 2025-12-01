"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Consola, estadoJuego, Orden } from "@/types/enums";

export default function FiltrosJuego() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtros, setFiltros] = useState({
    consola: searchParams.get("consola") || "",
    orden: (searchParams.get("orden") as Orden) || "",
    nombre: searchParams.get("nombre") || "",
    estado: searchParams.get("estado") || "",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();

      if (filtros.consola) params.set("consola", filtros.consola);
      if (filtros.orden) params.set("orden", filtros.orden);
      if (filtros.nombre) params.set("nombre", filtros.nombre);
      if (filtros.estado) params.set("estado", filtros.estado);

      router.push(`?${params.toString()}`);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [filtros, router]);

  const handleChange = (key: string, value: string) => {
    const nuevosFiltros = { ...filtros, [key]: value };
    setFiltros(nuevosFiltros);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Filtros</h3>

      <div>
        <label className="font-medium">Nombre</label>
        <input
          type="text"
          value={filtros.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="font-medium">Consola</label>
        <select
          value={filtros.consola}
          onChange={(e) => handleChange("consola", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todas</option>
          <option value={Consola.Xbox360}>Xbox 360</option>
          <option value={Consola.XboxOne}>Xbox One</option>
          <option value={Consola.XboxSeries}>Xbox Series</option>
          <option value={Consola.Ps3}>PlayStation 3</option>
          <option value={Consola.Ps4}>PlayStation 4</option>
          <option value={Consola.Ps5}>PlayStation 5</option>
          <option value={Consola.Switch}>Nintendo Switch</option>
          <option value={Consola.Switch2}>Nintendo Switch 2</option>
        </select>
      </div>
      <div>
        <label className="font-medium">Estado</label>
        <select
          value={filtros.estado}
          onChange={(e) => handleChange("estado", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Cualquiera</option>
          <option value={estadoJuego.nuevo}>Nuevo</option>
          <option value={estadoJuego.usado}>Usado</option>
        </select>
      </div>

      <div>
        <label className="font-medium">Ordenar por</label>
        <select
          value={filtros.orden}
          onChange={(e) => handleChange("orden", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value={Orden.ID_DESC}>Más recientes</option>
          <option value={Orden.ID}>Más antiguos</option>
          <option value={Orden.ABC}>A-Z</option>
          <option value={Orden.ABC_DESC}>Z-A</option>
        </select>
      </div>
    </div>
  );
}
