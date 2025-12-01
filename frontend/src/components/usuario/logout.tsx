"use client";
import { useState } from "react";

export default function LogOut() {
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    if (!confirm("¿Estás seguro de cerrar sesion?")) return;

    setLoading(true);
    try {
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "rol=; path=/; max-age=0";

      window.location.href = "/";
    } catch (error) {
      alert("Error al cerrar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogOut}
      disabled={loading}
      className="w-full border rounded p-3 "
    >
      {loading ? "Cerrando" : "Cerrar Sesion"}
    </button>
  );
}
