"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Save, Palette, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { name: session?.user?.name ?? "", email: session?.user?.email ?? "" },
  });

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  const initials = session?.user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-white/40" />
              <CardTitle className="text-sm">Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session?.user?.image ?? undefined} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="secondary" size="sm" type="button">Change avatar</Button>
                  <p className="text-xs text-white/30 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input {...register("name")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input {...register("email")} type="email" className="pl-9" disabled />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="gradient" loading={saving}>
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-white/40" />
              <CardTitle className="text-sm">Subscription</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Current plan</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {session?.user?.plan === "FREE" ? "5 projects · 10 generations/month" : "Unlimited projects · 100 generations/month"}
                </div>
              </div>
              <Badge variant={session?.user?.plan === "FREE" ? "secondary" : "gradient"}>
                {session?.user?.plan ?? "FREE"}
              </Badge>
            </div>
            <Separator />
            <Button variant="gradient">Upgrade to Pro — $19/mo</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-white/40" />
              <CardTitle className="text-sm">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button variant="secondary">Update password</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
