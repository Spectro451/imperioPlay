import RecuperarForm from "@/components/auth/recuperarForm";

export default function RecuperarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border rounded-lg shadow-md p-8 w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Recuperar Cuenta
        </h1>
        <RecuperarForm />
      </div>
    </div>
  );
}
