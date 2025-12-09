"use client";

interface StockPrecioProps {
  stock: number;
  precio: number;
  onStockChange: (stock: number) => void;
  onPrecioChange: (precio: number) => void;
}

export default function StockPrecioCampo({
  stock,
  precio,
  onStockChange,
  onPrecioChange,
}: StockPrecioProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Stock *</label>
        <input
          type="numeric"
          min="0"
          value={stock}
          onChange={(e) => {
            const value = e.target.value;
            onStockChange(value === "" ? 0 : parseInt(value) || 0);
          }}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Precio Base *</label>
        <input
          type="numeric"
          min="1"
          value={precio === 0 ? "" : precio}
          onChange={(e) => {
            const value = e.target.value;
            onPrecioChange(value === "" ? 0 : parseInt(value) || 0);
          }}
          className="w-full border rounded p-2"
          required
          placeholder="35000"
        />
      </div>
    </div>
  );
}
