interface Props {
  generacion: string;
  stock: number;
  estado: string;
}

export default function Badges({ generacion, stock, estado }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 border rounded-full text-sm">
        {generacion}
      </span>

      <span
        className={`px-3 py-1 border rounded-full text-sm ${
          stock > 10
            ? "border-green-600 text-green-600"
            : stock > 0
            ? "border-amber-600 text-amber-600"
            : "border-gray-400 text-gray-400"
        }`}
      >
        {stock > 10
          ? `Disponible (${stock})`
          : stock > 0
          ? `Últimas ${stock}`
          : "Agotado"}
      </span>

      <span className="px-3 py-1 border rounded-full text-sm">{estado}</span>
    </div>
  );
}
