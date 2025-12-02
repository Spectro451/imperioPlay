// _components/Badges.tsx
interface Props {
  consola: string;
  stock: number;
  estado: string;
  tier: number;
}

export default function Badges({ consola, stock, estado, tier }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 border rounded-full text-sm">{consola}</span>

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

      <span className="px-3 py-1 border rounded-full text-sm">Tier {tier}</span>
    </div>
  );
}
