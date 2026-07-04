"use client";

import React, { useState, useEffect } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";

interface PdfWorkspaceProps {
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

export function PdfWorkspace({
  tool,
  files,
  onClearFiles,
  inputs,
  onInputChange,
  onProcess,
  isProcessing,
  statusText,
  resultUrl
}: PdfWorkspaceProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    if (files.length > 0 && files[0].type === "application/pdf") {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      
      // We would normally use pdf.js here to get the actual page count
      // For now, we simulate it
      setPageCount(Math.floor(Math.random() * 10) + 1);

      return () => URL.revokeObjectURL(url);
    }
  }, [files]);

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
          {pageCount && (
            <div>
              <span className="block text-xs opacity-70">Pages</span>
              <span>{pageCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const rightSidebar = (
    <div className="p-6">
      <h3 className="text-sm font-bold text-on-surface mb-4">Settings</h3>

      {tool.slug === 'pdf-compress' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => onInputChange('quality', 'high')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-left transition-colors flex items-center justify-between"
            >
              <span>Max Compression</span> <span className="opacity-50 text-[10px]">Smallest File</span>
            </button>
            <button 
              onClick={() => onInputChange('quality', 'medium')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-left transition-colors flex items-center justify-between"
            >
              <span>Balanced</span> <span className="opacity-50 text-[10px]">Recommended</span>
            </button>
            <button 
              onClick={() => onInputChange('quality', 'low')}
              className="text-xs py-2 px-2 bg-surface-container hover:bg-primary/20 border border-white/5 rounded text-left transition-colors flex items-center justify-between"
            >
              <span>High Quality</span> <span className="opacity-50 text-[10px]">Least Compress</span>
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
      <div className="w-full h-full p-8 flex flex-col">
        {tool.slug === 'pdf-merge' ? (
           <div className="w-full h-full bg-surface-container/50 rounded border border-white/10 overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-max items-start content-start">
              {files.map((file, i) => (
                 <div key={i} className="aspect-[1/1.4] w-full bg-surface text-on-surface flex flex-col items-center justify-center rounded shadow-lg border border-white/10 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">picture_as_pdf</span>
                    <span className="font-bold text-sm text-center px-2 truncate w-full">{file.name}</span>
                    <span className="text-xs text-on-surface-variant mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                 </div>
              ))}
           </div>
        ) : tool.slug === 'pdf-split' ? (
           <div className="w-full h-full bg-surface-container/50 rounded border border-white/10 overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max items-start content-start">
              {Array.from({ length: pageCount || 1 }).map((_, i) => (
                 <div key={i} className="aspect-[1/1.4] w-full bg-surface text-on-surface flex flex-col items-center justify-center rounded shadow-lg border border-white/10 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all relative group">
                    <span className="material-symbols-outlined text-3xl opacity-20 group-hover:opacity-100 group-hover:text-primary transition-colors">description</span>
                    <span className="font-bold mt-2 text-sm">Page {i + 1}</span>
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-on-surface-variant flex items-center justify-center group-hover:border-primary">
                      <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-primary transition-colors"></div>
                    </div>
                 </div>
              ))}
           </div>
        ) : (
           <div className="flex-1 rounded overflow-hidden shadow-2xl border border-white/10">
              {previewUrl && (
                 <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-full bg-white" title="PDF Preview" />
              )}
           </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
