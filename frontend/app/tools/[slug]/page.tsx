"use client";

import React, { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useJobPoller } from "@/lib/hooks";
import { processLocally } from "@/lib/localProcessors";
import toolsConfig from "@/config/tools.json";
import { notFound } from "next/navigation";
import { ShareWidget } from "@/components/ShareWidget";
import { InteractiveWorkspace } from "@/components/workspace/InteractiveWorkspace";

export default function DynamicToolPage({ params }: { params: { slug: string } }) {
  const tool = toolsConfig.find(t => t.slug === params.slug);
  
  if (!tool) {
    notFound();
  }

  const [files, setFiles] = useState<File[]>([]);
  const [inputs, setInputs] = useState<Record<string, string | number>>(() => {
    const defaultState: Record<string, string | number> = {};
    tool.inputs?.forEach(input => {
      defaultState[input.name] = input.default;
    });
    return defaultState;
  });

  const [localProcessing, setLocalProcessing] = useState(false);
  const [localResultUrl, setLocalResultUrl] = useState<string | null>(null);

  const { startPolling, isProcessing: isPolling, statusText, resultUrl, error } = useJobPoller();
  
  const isProcessing = isPolling || localProcessing;
  const currentResultUrl = resultUrl || localResultUrl;

  // Telemetry: Log page view
  React.useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/v1/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "page_view", tool_slug: tool.slug })
    }).catch(console.error);
  }, [tool.slug]);

  const handleProcess = async (processInputs: Record<string, string | number>) => {
    if (files.length === 0) return;
    if (tool.multiple && files.length < 2) {
      alert("Please select at least 2 files");
      return;
    }
    if (files.length > 10) {
      alert("You can only process up to 10 files at once to prevent abuse.");
      return;
    }

    // Telemetry: Log job start
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/v1/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "job_start", tool_slug: tool.slug })
    }).catch(console.error);

    // Local Execution
    if ((tool as any).execution === "local") {
      setLocalProcessing(true);
      try {
        await processLocally(tool.slug, tool.multiple ? files : files[0], processInputs);
      } catch (err) {
        console.error(err);
        alert("An error occurred during local processing.");
      } finally {
        setLocalProcessing(false);
      }
      return;
    }

    // Server Execution
    const formData = new FormData();
    if (tool.multiple) {
      files.forEach(file => formData.append("files", file));
    } else {
      formData.append("file", files[0]);
    }

    Object.entries(processInputs).forEach(([k, v]) => formData.append(k, String(v)));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiUrl = `${API_URL}/api/v1/tools/${tool.slug}`;
      const res = await fetch(apiUrl, { method: "POST", body: formData });
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      const job_id = data.job_id;
      
      startPolling(job_id, apiUrl, `processed_${files[0].name}`);
      
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    }
  };

  if (files.length > 0 && !(tool.multiple && files.length < 2)) {
    return (
      <InteractiveWorkspace
        tool={tool}
        files={files}
        onClearFiles={() => setFiles([])}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        statusText={statusText}
        defaultInputs={inputs}
        resultUrl={currentResultUrl}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-surface">
      <div className="w-full max-w-3xl">
        <button onClick={() => window.history.back()} className="text-on-surface-variant hover:text-on-surface mb-8 flex items-center gap-2">← Back to Toolbox</button>
        <h1 className="text-display font-bold mb-4">{tool.name}</h1>
        <p className="text-body-lg text-on-surface-variant mb-4">{tool.description}</p>
        
        <div className="mb-8">
          <ShareWidget 
            url={typeof window !== 'undefined' ? window.location.href : `https://toolbox.pratyakshkwatra.com/tools/${tool.slug}`}
            title={`${tool.name} | Toolbox`}
            text={tool.description}
          />
        </div>
        {(tool as any).execution === "local" ? (
          <div className="flex items-center gap-2 mb-12 text-sm text-primary bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">lock</span> 
            <span><strong>Local Processing:</strong> This tool runs entirely in your browser. Your files never leave your device.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-12 text-sm text-green-400 bg-green-400/10 w-fit px-3 py-1 rounded-full border border-green-400/20">
            <span>☁️</span> 
            <span><strong>Server-Side Processing:</strong> Files are securely encrypted in transit and permanently deleted after 30 minutes.</span>
          </div>
        )}
        
        <Dropzone 
          onFileSelect={(newFiles) => setFiles(tool.multiple ? [...files, ...newFiles] : [newFiles[0]])} 
          accept={tool.accept} 
          multiple={tool.multiple}
        />
      </div>
    </main>
  );
}
