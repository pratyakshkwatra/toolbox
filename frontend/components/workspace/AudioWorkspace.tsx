"use client";

import React, { useState, useEffect, useRef } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";

interface AudioWorkspaceProps {
  tool: any;
  files: File[];
  onClearFiles: () => void;
  inputs: Record<string, string | number>;
  onInputChange: (name: string, value: string | number) => void;
  onProcess: () => void;
  isProcessing: boolean;
  statusText?: string;
  resultUrl?: string | null;
}

export function AudioWorkspace({
  tool,
  files,
  onClearFiles,
  inputs,
  onInputChange,
  onProcess,
  isProcessing,
  statusText,
  resultUrl
}: AudioWorkspaceProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (files.length > 0 && files[0].type.startsWith("audio/")) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const leftSidebar = (
    <div className="p-6">
      <h3 className="text-sm font-bold text-on-surface mb-4">File Info</h3>
      {files[0] && (
        <div className="space-y-3 text-sm text-on-surface-variant">
          <div>
            <span className="block text-xs opacity-70">Name</span>
            <span className="truncate block" title={files[0].name}>{files[0].name}</span>
          </div>
          <div>
            <span className="block text-xs opacity-70">Size</span>
            <span>{(files[0].size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div>
            <span className="block text-xs opacity-70">Type</span>
            <span>{files[0].type}</span>
          </div>
          {duration && (
            <div>
              <span className="block text-xs opacity-70">Duration</span>
              <span>{duration.toFixed(2)} seconds</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const rightSidebar = (
    <div className="p-6">
      <h3 className="text-sm font-bold text-on-surface mb-4">Settings</h3>
      {tool.inputs && tool.inputs.length > 0 ? (
        <div className="space-y-6">
          {tool.inputs.map((input: any, idx: number) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-2">{input.label}</label>
              {input.type === 'select' ? (
                <select 
                  value={inputs[input.name]} 
                  onChange={e => onInputChange(input.name, e.target.value)} 
                  disabled={isProcessing} 
                  className="w-full bg-surface border border-white/10 rounded px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50"
                >
                  {input.options?.map((opt: {value: string, label: string}) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={input.type} 
                  value={inputs[input.name]} 
                  onChange={e => onInputChange(input.name, e.target.value)} 
                  disabled={isProcessing} 
                  className="w-full bg-surface border border-white/10 rounded px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50 font-mono"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">No advanced settings available for this tool.</p>
      )}
    </div>
  );

  return (
    <WorkspaceLayout
      tool={tool}
      files={files}
      onClearFiles={onClearFiles}
      onExport={onProcess}
      isProcessing={isProcessing}
      statusText={statusText}
      resultUrl={resultUrl}
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
    >
      <div className="w-full h-full p-8 flex flex-col items-center justify-center">
         <div className="w-full max-w-4xl p-12 bg-surface-container rounded shadow-2xl flex flex-col items-center gap-8 border border-white/10">
            <div className="w-full h-32 bg-black/40 rounded overflow-hidden relative flex items-center justify-center">
               {/* Mock Waveform */}
               <div className="flex items-end justify-center gap-[2px] w-full h-full p-4 opacity-50">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="w-1 bg-primary rounded-t" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
                  ))}
               </div>
               <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary/20 border-r border-primary"></div>
            </div>
            
            {(previewUrl || resultUrl) && (
              <audio 
                ref={audioRef}
                src={resultUrl || previewUrl || undefined} 
                controls 
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full"
              />
            )}
         </div>
      </div>
    </WorkspaceLayout>
  );
}
