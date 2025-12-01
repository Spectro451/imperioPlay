"use client";
import { useState } from "react";
import { editarUsuario } from "@/lib/usuario";
import { useRouter } from "next/navigation";

export default function EditarForm({
  usuario,
  token,
}: {
  usuario: any;
  token: string;
}) {
  const [form, setForm] = useState({
    nombre: usuario.nombre,
    correo: usuario.correo,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await editarUsuario(token, usuario.id, form);
      router.push("/perfil");
    } catch (err) {
      setError("Error al editar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Correo</label>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border py-2 px-4 rounded-md"
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}
