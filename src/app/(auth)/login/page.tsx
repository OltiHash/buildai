import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign In — BuildAI" };

export default function LoginPage() {
  const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <LoginForm googleEnabled={googleEnabled} />;
}
