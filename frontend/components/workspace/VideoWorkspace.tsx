"use client";

import React, { useState, useEffect, useRef } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";

interface VideoWorkspaceProps {
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

export function VideoWorkspace({
  tool,
  files,
  onClearFiles,
  inputs,
  onInputChange,
  onProcess,
  isProcessing,
  statusText,
  resultUrl
}: VideoWorkspaceProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Pre-fill inputs if it's a trim tool
      if (tool.slug === 'video-trim') {
         if (!inputs.endTime || inputs.endTime === '00:00:10') {
             const d = videoRef.current.duration;
             const hrs = Math.floor(d / 3600);
             const mins = Math.floor((d % 3600) / 60);
             const secs = Math.floor(d % 60);
             const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
             onInputChange('endTime', formatted);
         }
      }
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

      {tool.slug === 'video-trim' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => { onInputChange('startTime', '00:00:00'); onInputChange('endTime', '00:00:15'); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              First 15s (Reels)
            </button>
            <button 
              onClick={() => { onInputChange('startTime', '00:00:00'); onInputChange('endTime', '00:00:30'); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              First 30s
            </button>
            <button 
              onClick={() => { onInputChange('startTime', '00:00:00'); onInputChange('endTime', '00:01:00'); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              First 60s (Shorts)
            </button>
          </div>
        </div>
      )}

      {tool.slug === 'video-rotate' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onInputChange('degrees', '90')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              90° Right
            </button>
            <button 
              onClick={() => onInputChange('degrees', '270')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              90° Left
            </button>
            <button 
              onClick={() => onInputChange('degrees', '180')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Upside Down
            </button>
          </div>
        </div>
      )}

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
         <div className="w-full max-w-4xl aspect-video bg-black rounded shadow-2xl overflow-hidden relative">
            {(previewUrl || resultUrl) && (
              <video 
                ref={videoRef}
                src={resultUrl || previewUrl || undefined} 
                controls 
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-contain"
                style={{
                  transform: tool.slug === 'video-rotate' && inputs.degrees ? `rotate(${inputs.degrees}deg)` : 'none',
                  transition: 'transform 0.3s ease'
                }}
              />
            )}
         </div>
         {tool.slug === 'video-trim' && (
           <div className="w-full max-w-4xl mt-8 bg-surface-container border border-white/10 rounded p-4">
              <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                 <span>Start</span>
                 <span>Timeline Preview</span>
                 <span>End</span>
              </div>
              <div className="h-16 bg-white/5 rounded relative flex items-center overflow-hidden">
                 {/* Decorative timeline waveform/thumbnails */}
                 <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik0wIDBMMjAgMjBMMDAgMjBaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>
                 
                 <div className="absolute left-1/4 right-1/4 h-full border-4 border-primary bg-primary/20 cursor-move"></div>
              </div>
              <p className="text-center text-xs text-on-surface-variant mt-2">Adjust trim handles (Mock UI)</p>
           </div>
         )}
      </div>
    </WorkspaceLayout>
  );
}
