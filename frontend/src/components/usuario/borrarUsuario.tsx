"use client";
import { deleteUsuario } from "@/lib/usuario";
import { useState } from "react";

export default function DeleteButton({
  userId,
  token,
}: {
  userId: number;
  token: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar tu cuenta?")) return;

    setLoading(true);
    try {
      await deleteUsuario(token, userId);

      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "rol=; path=/; max-age=0";

      window.location.href = "/";
    } catch (error) {
      alert("Error al eliminar cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full border rounded p-3 text-red-600"
    >
      {loading ? "Eliminando..." : "Eliminar Cuenta"}
    </button>
  );
}
