import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, ProjectFile, GenerationStep, Version } from "@/types";

interface ProjectStore {
  activeProject: Project | null;
  activeFile: ProjectFile | null;
  files: ProjectFile[];
  versions: Version[];
  generationSteps: GenerationStep[];
  isGenerating: boolean;
  previewMode: "desktop" | "tablet" | "mobile";
  editorTheme: "vs-dark" | "light";

  setActiveProject: (project: Project | null) => void;
  setActiveFile: (file: ProjectFile | null) => void;
  setFiles: (files: ProjectFile[]) => void;
  updateFile: (path: string, content: string) => void;
  setVersions: (versions: Version[]) => void;
  setGenerationSteps: (steps: GenerationStep[]) => void;
  updateGenerationStep: (id: string, status: GenerationStep["status"]) => void;
  setIsGenerating: (val: boolean) => void;
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setEditorTheme: (theme: "vs-dark" | "light") => void;
  reset: () => void;
}

const INITIAL_STEPS: GenerationStep[] = [
  { id: "analyze", label: "Analyzing prompt", status: "pending" },
  { id: "plan", label: "Creating structure plan", status: "pending" },
  { id: "generate", label: "Generating components", status: "pending" },
  { id: "style", label: "Applying styles", status: "pending" },
  { id: "optimize", label: "Optimizing code", status: "pending" },
  { id: "save", label: "Saving project", status: "pending" },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      activeProject: null,
      activeFile: null,
      files: [],
      versions: [],
      generationSteps: INITIAL_STEPS,
      isGenerating: false,
      previewMode: "desktop",
      editorTheme: "vs-dark",

      setActiveProject: (project) => set({ activeProject: project }),
      setActiveFile: (file) => set({ activeFile: file }),
      setFiles: (files) => set({ files }),
      updateFile: (path, content) =>
        set((state) => ({
          files: state.files.map((f) => (f.path === path ? { ...f, content } : f)),
          activeFile:
            state.activeFile?.path === path
              ? { ...state.activeFile, content }
              : state.activeFile,
        })),
      setVersions: (versions) => set({ versions }),
      setGenerationSteps: (steps) => set({ generationSteps: steps }),
      updateGenerationStep: (id, status) =>
        set((state) => ({
          generationSteps: state.generationSteps.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),
      setIsGenerating: (val) => set({ isGenerating: val }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setEditorTheme: (theme) => set({ editorTheme: theme }),
      reset: () =>
        set({
          activeProject: null,
          activeFile: null,
          files: [],
          versions: [],
          generationSteps: INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })),
          isGenerating: false,
        }),
    }),
    { name: "aibuilder-project", partialize: (s) => ({ editorTheme: s.editorTheme, previewMode: s.previewMode }) }
  )
);
