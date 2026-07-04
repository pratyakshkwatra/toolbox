"use client";

import React, { useState, useRef } from "react";

interface DropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

export function Dropzone({ onFileSelect, accept = "*/*", maxSizeMB = 10, multiple = false }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert(`Some files exceed the ${maxSizeMB}MB limit and were ignored.`);
    }
    
    if (validFiles.length > 0) {
      if (multiple) {
        onFileSelect(validFiles);
      } else {
        onFileSelect([validFiles[0]]);
      }
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        w-full p-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
        ${isDragOver 
          ? "border-primary-container bg-primary-container/10 shadow-[0_0_20px_rgba(255,122,0,0.2)]" 
          : "border-white/20 hover:border-white/40 bg-surface-container"}
      `}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        accept={accept}
        multiple={multiple}
      />
      <div className="w-16 h-16 mb-4 rounded-full bg-surface-bright flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <h3 className="text-headline-md font-medium mb-2">Drag & Drop your file(s) here</h3>
      <p className="text-body-sm text-on-surface-variant">or click to browse</p>
    </div>
  );
}
