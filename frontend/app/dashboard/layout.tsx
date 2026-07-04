"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-white/5 shadow-xl flex flex-col py-stack-md z-40 hidden md:flex">
        <div className="px-6 mb-stack-xl flex items-center gap-3">
          <img alt="Toolbox Logo" className="w-8 h-8" src="https://lh3.googleusercontent.com/aida/AP1WRLtlqnPZMalAE-ECPoo0B-yJVBZpU_yC_eAVmZghuBI4IhmbCsyD-YV1GYbbspCtNzHBGGWeWK19O-NjX7oQfDkAD0GpbXcFSq8BaWT8TFacRut6Y5Z4cqrJ1XRGvJrlAo5lc_ei6R4EYcCLJuGfnfLJlTpgUUY2GxI4hY-szPl3mB-HBjImYqict9-0tE9MRTWZGJUdNALXLDE-T5DbhNXZQsmGh7OS-XaOhMotYoTCR5Nb5SnF8paDWCGx" />
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">toolbox</h1>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-60">toolbox.pratyakshkwatra.com</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${pathname === '/dashboard' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link href="/category/pdf" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${pathname === '/category/pdf' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">picture_as_pdf</span>
            <span className="font-label-md text-label-md">PDF Tools</span>
          </Link>
          <Link href="/category/image" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${pathname === '/category/image' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">image</span>
            <span className="font-label-md text-label-md">Image Tools</span>
          </Link>
          <Link href="/category/video" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${pathname === '/category/video' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">movie</span>
            <span className="font-label-md text-label-md">Video Tools</span>
          </Link>
          <Link href="/category/audio" className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${pathname === '/category/audio' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">audio_file</span>
            <span className="font-label-md text-label-md">Audio Tools</span>
          </Link>
          
          <div className="pt-stack-md px-4 pb-2 mt-auto">
            <Link href="/" className="flex items-center gap-3 text-on-surface-variant hover:bg-white/5 px-4 py-2 cursor-pointer transition-all rounded-lg">
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span className="font-label-md text-label-md">Back to Home</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Viewport */}
      <main className="md:ml-64 min-h-screen relative">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface/70 backdrop-blur-xl border-b border-white/10 z-30 px-margin-desktop flex justify-between items-center shadow-sm">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
              <input className="w-full bg-surface-container-lowest border border-white/5 rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm focus:outline-none focus:border-primary/50 transition-colors" placeholder="Search for tools, docs, or files..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-stack-md ml-stack-md">
            <button 
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95 bg-transparent rounded-full hover:bg-white/5"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <a href="https://github.com/pratyakshkwatra" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <img alt="GitHub" className="w-5 h-5 invert opacity-70 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6a9Tmj32JSXVqgjVrIEHw0xnfs5dibU4YRqXx0dnA1LDMRzqv8cmmP2Zs4Vaey3Qwcr9jzsJwZWGVntkIQFvdU8ho-9xisRcu7YZjayH-ldJ9-4fdk06WJgtbYT6_JtwPHKZXb7TAWgO0tqC58R3nuRfBcMRcRY2E5dk2x2yot5BXey0axMTV9NZEPP76ypyZpaJfopop81afDgTL5jw0rZVTnqcEsdySxGIsjF7NEVfOt3LgaUqqlvITT53ES-Jhe3kIv0-Kjsd" />
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="pt-24 pb-12 px-margin-desktop max-w-container-max mx-auto">
          {children}
        </div>

        {/* Floating Activity Indicator (Atmospheric) */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-primary w-2 h-2 rounded-full"></div>
            </div>
            <span className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Network Secure</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="md:ml-64 bg-surface-container-lowest py-stack-lg border-t border-white/5 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-stack-md">
          <div className="flex items-center gap-4">
            <span className="font-label-md text-label-md font-bold text-on-surface">Toolbox</span>
            <span className="text-on-secondary-container font-caption text-caption">© 2024 Toolbox Utility. Built for performance.</span>
          </div>
          <div className="flex gap-stack-md">
            <a className="text-on-surface font-caption text-caption hover:text-primary transition-colors underline flex items-center gap-1" href="https://github.com/pratyakshkwatra"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6a9Tmj32JSXVqgjVrIEHw0xnfs5dibU4YRqXx0dnA1LDMRzqv8cmmP2Zs4Vaey3Qwcr9jzsJwZWGVntkIQFvdU8ho-9xisRcu7YZjayH-ldJ9-4fdk06WJgtbYT6_JtwPHKZXb7TAWgO0tqC58R3nuRfBcMRcRY2E5dk2x2yot5BXey0axMTV9NZEPP76ypyZpaJfopop81afDgTL5jw0rZVTnqcEsdySxGIsjF7NEVfOt3LgaUqqlvITT53ES-Jhe3kIv0-Kjsd" className="w-3 h-3 invert" alt="GitHub" />GitHub</a>
            <a className="text-on-secondary-container font-caption text-caption hover:text-primary transition-colors underline" href="#">Documentation</a>
            <a className="text-on-secondary-container font-caption text-caption hover:text-primary transition-colors underline" href="#">Privacy</a>
            <a className="text-on-secondary-container font-caption text-caption hover:text-primary transition-colors underline" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
