"use client";
import { useState } from "react";
import { Login } from "@/lib/login";
import Link from "next/link";

export default function LoginForm() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await Login(form.correo, form.password);
      window.location.href = "/";
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
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
        <label className="block text-sm font-medium">Correo</label>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="mt-1 block w-full border  rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 block w-full border  rounded-md px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border  py-2 px-4 rounded-md"
      >
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      <div className="text-center">
        <Link
          href="/auth/recuperar"
          className="text-sm text-blue-500 hover:underline"
        >
          Recuperar Cuenta
        </Link>
      </div>
      <div className="text-center">
        <Link
          href="/auth/register"
          className="text-sm text-blue-500 hover:underline"
        >
          Registrate
        </Link>
      </div>
    </form>
  );
}
