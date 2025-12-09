"use client";
import Image from "next/image";
import { useState } from "react";

interface Props {
  fotos?: string[];
  nombre: string;
}

export default function Fotos({ fotos, nombre }: Props) {
  const [imagenPrincipal, setImagenPrincipal] = useState(fotos?.[0] || "");

  const fotosValidas = fotos?.filter((foto) => foto && foto.trim() !== "");

  if (!fotosValidas || fotosValidas.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        <span className="text-lg">Sin imagen disponible</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden aspect-square">
        <Image
          src={imagenPrincipal || fotosValidas[0]}
          alt={nombre}
          width={500}
          height={500}
          className="w-full h-full object-fit"
        />
      </div>

      {fotosValidas.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {fotosValidas.map((foto, index) => (
            <button
              key={index}
              onClick={() => setImagenPrincipal(foto)}
              className={`w-20 h-20 border rounded overflow-hidden flex-shrink-0 ${
                foto === imagenPrincipal ? "ring-2 ring-black" : ""
              }`}
            >
              <Image
                src={foto}
                alt={`${nombre} vista ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
