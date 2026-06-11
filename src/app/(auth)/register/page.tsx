import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create Account — BuildAI" };

export default function RegisterPage() {
  const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <RegisterForm googleEnabled={googleEnabled} />;
}
