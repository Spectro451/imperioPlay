"use client";

interface DescuentoProps {
  descuentoPorcentaje: number;
  descuentoFijo: number;
  onDescuentoPorcentajeChange: (value: number) => void;
  onDescuentoFijoChange: (value: number) => void;
}

export default function DescuentoCampos({
  descuentoPorcentaje,
  descuentoFijo,
  onDescuentoPorcentajeChange,
  onDescuentoFijoChange,
}: DescuentoProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Descuento Porcentual (%)
          </label>
          <input
            type="numeric"
            min="0"
            max="100"
            value={descuentoPorcentaje === 0 ? "" : descuentoPorcentaje}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onDescuentoPorcentajeChange(value);
              if (value > 0) onDescuentoFijoChange(0);
            }}
            className="w-full border rounded p-2"
            placeholder="0-100%"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descuento Fijo ($)
          </label>
          <input
            type="numeric"
            min="0"
            value={descuentoFijo === 0 ? "" : descuentoFijo}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onDescuentoFijoChange(value);
              if (value > 0) onDescuentoPorcentajeChange(0);
            }}
            className="w-full border rounded p-2"
            placeholder="Monto fijo"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {descuentoPorcentaje > 0 && (
          <p>Descuento porcentual activo: {descuentoPorcentaje}%</p>
        )}
        {descuentoFijo > 0 && (
          <p>Descuento fijo activo: ${descuentoFijo.toLocaleString()}</p>
        )}
        {descuentoPorcentaje === 0 && descuentoFijo === 0 && (
          <p>Sin descuento aplicado</p>
        )}
      </div>
    </>
  );
}
