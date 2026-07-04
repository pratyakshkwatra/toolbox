"use client";

import React, { useState } from "react";
import { Dropzone } from "@/components/ui/Dropzone";
import { useJobPoller } from "@/lib/hooks";
import toolsConfig from "@/config/tools.json";
import { notFound } from "next/navigation";

export default function DynamicToolPage({ params }: { params: { slug: string } }) {
  const tool = toolsConfig.find(t => t.slug === params.slug);
  
  if (!tool) {
    notFound();
  }

  const [files, setFiles] = useState<File[]>([]);
  const [inputs, setInputs] = useState<Record<string, unknown>>(() => {
    const defaultState: Record<string, unknown> = {};
    tool.inputs?.forEach(input => {
      defaultState[input.name] = input.default;
    });
    return defaultState;
  });

  const { isProcessing, statusText, startPolling } = useJobPoller();

  // Telemetry: Log page view
  React.useEffect(() => {
    fetch("http://localhost:8000/api/v1/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "page_view", tool_slug: tool.slug })
    }).catch(console.error);
  }, [tool.slug]);

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (tool.multiple && files.length < 2) {
      alert("Please select at least 2 files");
      return;
    }

    // Telemetry: Log job start
    fetch("http://localhost:8000/api/v1/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "job_start", tool_slug: tool.slug })
    }).catch(console.error);

    const formData = new FormData();
    if (tool.multiple) {
      files.forEach(f => formData.append("files", f));
    } else {
      formData.append("file", files[0]);
    }

    // Append dynamic inputs
    Object.entries(inputs).forEach(([key, val]) => {
      formData.append(key, val.toString());
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/process/${tool.slug}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit job");

      const { job_id } = await response.json();
      startPolling(job_id, apiUrl, `processed_${files[0].name}`);
      
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-surface">
      <div className="w-full max-w-3xl">
        <button onClick={() => window.history.back()} className="text-on-surface-variant hover:text-on-surface mb-8 flex items-center gap-2">← Back to Toolbox</button>
        <h1 className="text-display font-bold mb-4">{tool.name}</h1>
        <p className="text-body-lg text-on-surface-variant mb-6">{tool.description}</p>
        
        <div className="flex items-center gap-2 mb-12 text-sm text-green-400 bg-green-400/10 w-fit px-3 py-1 rounded-full border border-green-400/20">
          <span>☁️</span> 
          <span><strong>Server-Side Processing:</strong> Files are securely encrypted in transit and permanently deleted after 30 minutes.</span>
        </div>
        
        {files.length === 0 || (tool.multiple && files.length < 2) ? (
          <Dropzone 
            onFileSelect={(newFiles) => setFiles(tool.multiple ? [...files, ...newFiles] : [newFiles[0]])} 
            accept={tool.accept} 
            multiple={tool.multiple}
          />
        ) : (
          <div className="glass-card p-8 w-full">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <span className="font-medium text-on-surface">{tool.multiple ? `${files.length} files selected` : files[0].name}</span>
              <button onClick={() => setFiles([])} className="text-error" disabled={isProcessing}>Clear</button>
            </div>
            
            {tool.inputs && tool.inputs.length > 0 && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.inputs.map((input, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium mb-2">{input.label}</label>
                    {input.type === 'select' ? (
                      <select 
                        value={inputs[input.name]} 
                        onChange={e => setInputs({...inputs, [input.name]: e.target.value})} 
                        disabled={isProcessing} 
                        className="w-full bg-surface-container border border-white/10 rounded px-4 py-3 text-on-surface"
                      >
                        {input.options?.map((opt: {value: string, label: string}) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : input.type === 'range' ? (
                       <input 
                        type="range" 
                        min={input.min} max={input.max}
                        value={inputs[input.name]} 
                        onChange={e => setInputs({...inputs, [input.name]: e.target.value})} 
                        disabled={isProcessing} 
                        className="w-full h-1 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary-container"
                      />
                    ) : (
                      <input 
                        type={input.type} 
                        value={inputs[input.name]} 
                        onChange={e => setInputs({...inputs, [input.name]: e.target.value})} 
                        disabled={isProcessing} 
                        className="w-full bg-surface-container border border-white/10 rounded px-4 py-2 text-on-surface font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button onClick={handleUpload} disabled={isProcessing} className="btn-primary w-full py-4 text-lg">
              {isProcessing ? statusText || "Processing..." : `Run ${tool.name}`}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
