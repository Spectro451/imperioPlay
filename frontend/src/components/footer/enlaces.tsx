import Link from "next/link";

export default function Enlaces() {
  return (
    <div className="text-center md:text-left">
      <h2 className="font-bold mb-4">Enlaces</h2>
      <div className="flex flex-col gap-2">
        <Link href="/terminos" className="hover:underline">
          Términos y Condiciones
        </Link>
        <Link href="/privacidad" className="hover:underline">
          Política de Privacidad
        </Link>
        <Link href="/preguntas-frecuentes" className="hover:underline">
          Preguntas Frecuentes
        </Link>
        <Link href="/devoluciones" className="hover:underline">
          Intercambios y Devoluciones
        </Link>
      </div>
    </div>
  );
}
