"use client";
import { useState } from "react";
import { cambiarContraseña } from "@/lib/usuario";
import { useRouter } from "next/navigation";

export default function CambiarPassForm({
  usuario,
  token,
}: {
  usuario: any;
  token: string;
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await cambiarContraseña(token, usuario.id, form);
      router.push("/perfil");
    } catch (err) {
      setError("Error al cambiar contraseña");
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
        <label className="block text-sm font-medium">Contraseña Actual</label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          className="mt-1 block w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nueva Contraseña</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border py-2 px-4 rounded-md"
      >
        {loading ? "Cambiando..." : "Cambiar Contraseña"}
      </button>
    </form>
  );
}
