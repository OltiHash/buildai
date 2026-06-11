"use client";

import Editor from "@monaco-editor/react";
import { useProjectStore } from "@/store/project.store";
import { useEffect, useRef } from "react";
import type { editor } from "monaco-editor";

interface Props {
  path: string;
  language: string;
  theme: string;
}

export default function CodeEditor({ path, language, theme }: Props) {
  const { activeFile, updateFile } = useProjectStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount = (ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed;
    ed.addAction({
      id: "save-file",
      label: "Save File",
      keybindings: [2097 /* CtrlCmd+S */],
      run: () => {
        // Auto-save handled via change handler
      },
    });
  };

  useEffect(() => {
    if (editorRef.current && activeFile?.content !== undefined) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== activeFile.content) {
        model.setValue(activeFile.content);
      }
    }
  }, [activeFile?.path, activeFile?.content]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={activeFile?.content ?? ""}
        theme={theme}
        path={path}
        onChange={(value) => {
          if (value !== undefined) updateFile(path, value);
        }}
        onMount={handleMount}
        options={{
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "gutter",
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 4,
            horizontalScrollbarSize: 4,
          },
        }}
      />
    </div>
  );
}
