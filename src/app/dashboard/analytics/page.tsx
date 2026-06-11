"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Zap, Rocket, FolderOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      return res.json();
    },
  });

  const stats = [
    { label: "AI Generations", value: data?.totalGenerated ?? 0, icon: Zap, color: "text-violet-400" },
    { label: "Total Projects", value: data?.totalProjects ?? 0, icon: FolderOpen, color: "text-blue-400" },
    { label: "Deployments", value: data?.totalDeployed ?? 0, icon: Rocket, color: "text-emerald-400" },
    { label: "Avg/Day", value: (data?.generationsByDay?.reduce((a: number, d: { count: number }) => a + d.count, 0) ?? 0) / 30, icon: TrendingUp, color: "text-amber-400", decimal: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-white/40 mt-1">Last 30 days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, decimal }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card glass>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">{label}</span>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 skeleton rounded" />
                ) : (
                  <div className="text-3xl font-bold text-white">
                    {decimal ? value.toFixed(1) : value}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle className="text-sm">Generations per day</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data?.generationsByDay ?? []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                    tickFormatter={(v: string) => v.slice(5)}
                    interval={6}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={20}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                    itemStyle={{ color: "#8b5cf6" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="text-sm">Weekly breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={(data?.generationsByDay ?? []).slice(-7)}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                    tickFormatter={(v: string) => v.slice(5)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={20}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                    itemStyle={{ color: "#6366f1" }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
