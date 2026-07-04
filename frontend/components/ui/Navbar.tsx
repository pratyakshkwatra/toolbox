"use client";

import Link from "next/link";
export default function Navbar() {
  return (
    <>
      <nav className="w-full border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Toolbox <span className="text-primary-container">.</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-on-surface hover:text-primary-container transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
