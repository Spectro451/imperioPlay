import LoginForm from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-2">
      <div className="border-1 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}
