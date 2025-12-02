// _components/Precios.tsx
interface Props {
  precio_base: number;
  precio_final: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
}

export default function Precios({
  precio_base,
  precio_final,
  descuento_porcentaje,
  descuento_fijo,
}: Props) {
  const hasDiscount = precio_final !== precio_base;

  return (
    <div className="py-4 border-y">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-bold">
          ${precio_final.toLocaleString()}
        </span>

        {hasDiscount && (
          <span className="text-lg line-through opacity-60">
            ${precio_base.toLocaleString()}
          </span>
        )}
      </div>

      {hasDiscount && (
        <div className="flex gap-4">
          {(descuento_porcentaje ?? 0) > 0 && (
            <span className="px-3 py-1 border rounded text-sm">
              {descuento_porcentaje}% OFF
            </span>
          )}
          {(descuento_fijo ?? 0) > 0 && (
            <span className="px-3 py-1 border rounded text-sm">
              Ahorras ${(descuento_fijo || 0).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
