"use client";

import React, { useState } from "react";
import { ImageWorkspace } from "./ImageWorkspace";
import { PdfWorkspace } from "./PdfWorkspace";
import { VideoWorkspace } from "./VideoWorkspace";
import { AudioWorkspace } from "./AudioWorkspace";

interface InteractiveWorkspaceProps {
  tool: any;
  files: File[];
  onClearFiles: () => void;
  onProcess: (inputs: Record<string, string | number>) => void;
  isProcessing: boolean;
  statusText?: string;
  defaultInputs: Record<string, string | number>;
  resultUrl?: string | null;
}

export function InteractiveWorkspace({
  tool,
  files,
  onClearFiles,
  onProcess,
  isProcessing,
  statusText,
  defaultInputs,
  resultUrl
}: InteractiveWorkspaceProps) {
  const [inputs, setInputs] = useState<Record<string, string | number>>(defaultInputs);

  const handleInputChange = (name: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleProcess = () => {
    onProcess(inputs);
  };

  if (tool.category === 'image') {
    return (
      <ImageWorkspace
        tool={tool}
        files={files}
        onClearFiles={onClearFiles}
        inputs={inputs}
        onInputChange={handleInputChange}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        statusText={statusText}
        resultUrl={resultUrl}
      />
    );
  }

  if (tool.category === 'pdf') {
    return (
      <PdfWorkspace
        tool={tool}
        files={files}
        onClearFiles={onClearFiles}
        inputs={inputs}
        onInputChange={handleInputChange}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        statusText={statusText}
        resultUrl={resultUrl}
      />
    );
  }

  if (tool.category === 'video') {
    return (
      <VideoWorkspace
        tool={tool}
        files={files}
        onClearFiles={onClearFiles}
        inputs={inputs}
        onInputChange={handleInputChange}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        statusText={statusText}
        resultUrl={resultUrl}
      />
    );
  }

  if (tool.category === 'audio') {
    return (
      <AudioWorkspace
        tool={tool}
        files={files}
        onClearFiles={onClearFiles}
        inputs={inputs}
        onInputChange={handleInputChange}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        statusText={statusText}
        resultUrl={resultUrl}
      />
    );
  }

  // Fallback
  return (
    <div className="flex flex-col h-screen items-center justify-center text-on-surface p-8">
      <h2 className="text-2xl font-bold mb-4">{tool.category.toUpperCase()} Workspace (WIP)</h2>
      <p className="mb-4">This workspace is currently under construction as part of the redesign.</p>
      <button onClick={onClearFiles} className="btn-primary px-4 py-2">Go Back</button>
    </div>
  );
}
