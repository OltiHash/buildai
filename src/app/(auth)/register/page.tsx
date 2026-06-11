"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Mail, Lock, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">BuildAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-white/40 mt-1">Start building for free</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl space-y-5">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/dashboard" }); }}
            loading={googleLoading}
          >
            <Globe className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-white/20">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input id="name" placeholder="John Doe" className="pl-9" {...register("name")} />
              </div>
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input id="password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" className="pl-9" {...register("password")} />
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-xs text-white/20 text-center leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-white/40 hover:text-white/60">Terms</Link> and{" "}
            <Link href="#" className="text-white/40 hover:text-white/60">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white/60 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
