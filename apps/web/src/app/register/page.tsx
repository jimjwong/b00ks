import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
