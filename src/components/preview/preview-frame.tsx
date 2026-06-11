"use client";

import { useEffect, useRef } from "react";
import { useProjectStore } from "@/store/project.store";

interface Props {
  projectId: string;
}

export function PreviewFrame({ projectId: _projectId }: Props) {
  const { files, activeFile } = useProjectStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Find HTML file
    const htmlFile = files.find((f) => f.name === "index.html" || f.language === "html");
    if (!htmlFile) return;

    let html = htmlFile.content;

    // Inject CSS files inline
    const cssFiles = files.filter((f) => f.language === "css");
    const cssInline = cssFiles.map((f) => `<style>${f.content}</style>`).join("\n");
    html = html.replace("</head>", `${cssInline}\n</head>`);

    // Inject JS files inline
    const jsFiles = files.filter((f) => f.language === "js" || f.language === "javascript");
    const jsInline = jsFiles.map((f) => `<script>${f.content}</script>`).join("\n");
    html = html.replace("</body>", `${jsInline}\n</body>`);

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => URL.revokeObjectURL(url);
  }, [files, activeFile]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full rounded-xl border border-white/10 bg-white"
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="Website Preview"
    />
  );
}
