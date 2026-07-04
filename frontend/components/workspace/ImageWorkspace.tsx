"use client";

import React, { useState, useRef, useEffect } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";

interface ImageWorkspaceProps {
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

export function ImageWorkspace({
  tool,
  files,
  onClearFiles,
  inputs,
  onInputChange,
  onProcess,
  isProcessing,
  statusText,
  resultUrl
}: ImageWorkspaceProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

  useEffect(() => {
    if (canvasRef.current && dimensions) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Apply basic effects for preview based on inputs
        if (tool.slug === 'image-compress') {
           canvas.width = dimensions.width;
           canvas.height = dimensions.height;
           // If we have the final result, show it without blur
           if (resultUrl) {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.drawImage(img, 0, 0);
           } else {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             const quality = Number(inputs.quality) || 80;
             // Simulate compression artifacting by slightly blurring lower qualities
             const blurAmt = quality < 50 ? (50 - quality) / 10 : 0;
             ctx.filter = `blur(${blurAmt}px)`;
             ctx.drawImage(img, 0, 0);
             ctx.filter = 'none'; // reset
           }
        } else if (tool.slug === 'image-resize' && !resultUrl) {
           const targetW = Number(inputs.width) || dimensions.width;
           const targetH = Number(inputs.height) || dimensions.height;
           canvas.width = targetW;
           canvas.height = targetH;
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           ctx.drawImage(img, 0, 0, targetW, targetH);
        } else {
           canvas.width = dimensions.width;
           canvas.height = dimensions.height;
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           ctx.drawImage(img, 0, 0);
        }
      };
      // Load the result if processing finished, otherwise load the preview
      img.src = resultUrl || previewUrl || "";
    }
  }, [previewUrl, inputs, dimensions, tool.slug, resultUrl]);


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
          {dimensions && (
            <div>
              <span className="block text-xs opacity-70">Dimensions</span>
              <span>{dimensions.width} x {dimensions.height} px</span>
            </div>
          )}
          {tool.slug === 'image-compress' && inputs.quality && (
             <div className="mt-4 pt-4 border-t border-white/10">
               <span className="block text-xs text-primary font-bold">Estimated Output</span>
               <span>~{((files[0].size / 1024 / 1024) * (Number(inputs.quality) / 100)).toFixed(2)} MB</span>
             </div>
          )}
        </div>
      )}
    </div>
  );

  const rightSidebar = (
    <div className="p-6">
      <h3 className="text-sm font-bold text-on-surface mb-4">Settings</h3>
      
      {tool.slug === 'image-resize' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => { onInputChange('width', 1080); onInputChange('height', 1080); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Instagram (1:1)
            </button>
            <button 
              onClick={() => { onInputChange('width', 1920); onInputChange('height', 1080); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              1080p HD (16:9)
            </button>
            <button 
              onClick={() => { onInputChange('width', 1280); onInputChange('height', 720); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              720p HD (16:9)
            </button>
            <button 
              onClick={() => { onInputChange('width', 800); onInputChange('height', 800); }}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Avatar (1:1)
            </button>
          </div>
        </div>
      )}

      {tool.slug === 'image-compress' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onInputChange('quality', 95)}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Max Quality (95%)
            </button>
            <button 
              onClick={() => onInputChange('quality', 80)}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Balanced (80%)
            </button>
            <button 
              onClick={() => onInputChange('quality', 60)}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Web Optimized (60%)
            </button>
            <button 
              onClick={() => onInputChange('quality', 30)}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-center transition-colors"
            >
              Max Compress (30%)
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
              ) : input.type === 'range' ? (
                <div>
                  <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                    <span>{input.min}</span>
                    <span>{inputs[input.name]}</span>
                    <span>{input.max}</span>
                  </div>
                  <input 
                    type="range" 
                    min={input.min} max={input.max}
                    value={inputs[input.name]} 
                    onChange={e => onInputChange(input.name, e.target.value)} 
                    disabled={isProcessing} 
                    className="w-full h-1 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ) : (
                <input 
                  type={input.type} 
                  value={inputs[input.name]} 
                  onChange={e => onInputChange(input.name, e.target.value)} 
                  disabled={isProcessing} 
                  className="w-full bg-surface border border-white/10 rounded px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
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
      {/* Canvas Area */}
      <div className="w-full h-full p-8 flex items-center justify-center overflow-auto">
         <div className="relative border border-white/10 bg-black/20 shadow-2xl overflow-hidden rounded flex items-center justify-center" style={{ minWidth: 200, minHeight: 200 }}>
             <canvas ref={canvasRef} className="max-w-full max-h-[80vh] object-contain" />
         </div>
      </div>
    </WorkspaceLayout>
  );
}
