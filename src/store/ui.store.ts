import { create } from "zustand";

interface UIStore {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  theme: "light" | "dark" | "system";
  notifications: Notification[];

  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setTheme: (t: "light" | "dark" | "system") => void;
  addNotification: (n: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  theme: "dark",
  notifications: [],

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setTheme: (t) => set({ theme: t }),
  addNotification: (n) =>
    set((s) => ({
      notifications: [...s.notifications, { ...n, id: Math.random().toString(36).slice(2) }],
    })),
  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));
