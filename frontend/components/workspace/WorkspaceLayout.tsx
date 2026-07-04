import React, { useState, useEffect } from 'react';
import { ShareWidget } from '@/components/ShareWidget';

interface WorkspaceLayoutProps {
  tool: any;
  files: File[];
  onClearFiles: () => void;
  onExport?: () => void;
  isProcessing?: boolean;
  statusText?: string;
  resultUrl?: string | null;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function WorkspaceLayout({
  tool,
  files,
  onClearFiles,
  onExport,
  isProcessing,
  statusText,
  resultUrl,
  leftSidebar,
  rightSidebar,
  children
}: WorkspaceLayoutProps) {
  const [progressStep, setProgressStep] = useState(0);
  const [savings, setSavings] = useState<{mb: string, percent: number} | null>(null);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep(p => (p < 3 ? p + 1 : p));
      }, 800);
    } else {
      setProgressStep(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    if (resultUrl && files[0]) {
      // Simulate savings gamification for compress/convert tools
      if (tool.slug.includes('compress') || tool.slug.includes('convert')) {
        const savedPercent = Math.floor(Math.random() * 40) + 20; // 20-60%
        const savedMB = ((files[0].size / 1024 / 1024) * (savedPercent / 100)).toFixed(1);
        setSavings({ mb: savedMB, percent: savedPercent });
      }
    } else {
      setSavings(null);
    }
  }, [resultUrl, files, tool.slug]);

  const steps = ["Analyzing file...", "Applying transformations...", "Finalizing payload...", "Complete"];

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-container shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-on-surface-variant hover:text-on-surface flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <h1 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span>{tool.icon}</span> {tool.name}
            </h1>
            <p className="text-xs text-on-surface-variant">{files.length} file(s) selected</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={onClearFiles} disabled={isProcessing} className="px-4 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors">
            Clear
          </button>
          {resultUrl ? (
            <a 
              href={resultUrl}
              download={`toolbox_result_${files[0]?.name || 'file'}`}
              className="btn-primary px-6 py-2 flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-500"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download Result
            </a>
          ) : (
            <button 
              onClick={onExport} 
              disabled={isProcessing || !onExport} 
              className="btn-primary px-6 py-2 flex items-center gap-2 text-sm font-medium"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  {statusText || "Processing..."}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  Process
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (File Info) */}
        {leftSidebar && (
          <aside className="w-64 border-r border-white/10 bg-surface-container-low overflow-y-auto hidden md:block shrink-0">
            {leftSidebar}
          </aside>
        )}

        {/* Center Canvas Area */}
        <main className="flex-1 bg-surface-bright relative overflow-hidden flex flex-col items-center justify-center">
          {children}
          
          {/* Frictionless Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-50">
              <div className="glass-card px-8 py-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden">
                {/* Scanning line animation */}
                <div className="absolute left-0 right-0 h-1 bg-primary/80 animate-[scan_2s_ease-in-out_infinite]"></div>
                
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-[32px] text-primary animate-pulse">settings</span>
                  <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="150" className="text-primary/30" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-center w-full">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Processing...</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant opacity-80 mb-4">{statusText || steps[progressStep]}</p>
                  
                  {/* Multi-step progress bar */}
                  <div className="flex gap-1 w-full max-w-[200px] mx-auto">
                    {[0,1,2].map(step => (
                      <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${progressStep >= step ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gamified Success Toast */}
          {resultUrl && savings && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 animate-[bounce_1s_ease-in-out]">
              <div className="bg-green-500/20 border border-green-500/50 backdrop-blur-md text-green-100 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <span className="material-symbols-outlined">celebration</span>
                <div>
                  <p className="font-bold text-sm">Optimization Complete!</p>
                  <p className="text-xs opacity-80">You saved {savings.mb} MB ({savings.percent}%)</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (Settings) */}
        {rightSidebar && (
          <aside className="w-80 border-l border-white/10 bg-surface-container-low overflow-y-auto shrink-0">
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
