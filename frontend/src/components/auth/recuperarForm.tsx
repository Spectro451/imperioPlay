"use client";
import { useState } from "react";
import { recuperarCuenta } from "@/lib/usuario";

export default function RecuperarForm() {
  const [form, setForm] = useState({
    correo: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await recuperarCuenta(form);
      alert("Cuenta recuperada exitosamente");
      window.location.href = "/auth/login";
    } catch (err) {
      setError("Error al recuperar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="border rounded p-3">{error}</div>}

      <div>
        <label className="block text-sm font-medium">Correo</label>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border rounded p-2"
      >
        {loading ? "Recuperando..." : "Recuperar Cuenta"}
      </button>
    </form>
  );
}
