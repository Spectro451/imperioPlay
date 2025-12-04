import RegisterForm from "@/components/auth/registerForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className=" p-8 rounded-lg shadow-md w-96 border">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
