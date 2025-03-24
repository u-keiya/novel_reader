import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  );
}