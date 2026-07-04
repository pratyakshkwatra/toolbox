"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toolsConfig from '@/config/tools.json';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<Record<string, number>>({});
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/v1/analytics/popular`);
        if (res.ok) {
          const data: { tool_slug: string, count: number }[] = await res.json();
          const map: Record<string, number> = {};
          data.forEach(d => map[d.tool_slug] = d.count);
          setAnalyticsData(map);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  const getToolScore = (slug: string) => {
    // If backend has a count, use it. Otherwise fallback to 0 or 1.
    return analyticsData[slug] || 0;
  };

  const popularTools = [...toolsConfig]
    .sort((a, b) => getToolScore(b.slug) - getToolScore(a.slug))
    .slice(0, 6);
  
  const categoryScores = toolsConfig.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + getToolScore(tool.slug);
    return acc;
  }, {} as Record<string, number>);

  const allCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const formatUsage = (score: number) => {
    if (isLoadingAnalytics) return "...";
    if (score === 0) return "New tool!";
    if (score >= 100000) return `${Math.floor(score / 1000)}k+ users`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k+ users`;
    return `${score} users`;
  };

  const categoryMeta: Record<string, any> = {
    pdf: { icon: "picture_as_pdf", title: "PDF Tools", desc: "Merge, split, compress, and convert PDF documents with millisecond precision.", colorClass: "bg-primary/10 text-primary" },
    image: { icon: "image", title: "Image Tools", desc: "Bulk optimize, resize, and transform your visuals without losing a single pixel of quality.", colorClass: "bg-tertiary/10 text-tertiary" },
    video: { icon: "movie", title: "Video & Audio", desc: "Transcode, trim, and adjust media files directly in your browser.", colorClass: "bg-secondary/10 text-secondary" },
    audio: { icon: "headphones", title: "Audio Tools", desc: "Convert, split, and edit audio files effortlessly.", colorClass: "bg-primary/10 text-primary" },
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Micro-interactions and subtle effects
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-surface/70 shadow-sm">
        <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <img alt="toolbox logo" className="w-8 h-8" src="https://lh3.googleusercontent.com/aida/AP1WRLtlqnPZMalAE-ECPoo0B-yJVBZpU_yC_eAVmZghuBI4IhmbCsyD-YV1GYbbspCtNzHBGGWeWK19O-NjX7oQfDkAD0GpbXcFSq8BaWT8TFacRut6Y5Z4cqrJ1XRGvJrlAo5lc_ei6R4EYcCLJuGfnfLJlTpgUUY2GxI4hY-szPl3mB-HBjImYqict9-0tE9MRTWZGJUdNALXLDE-T5DbhNXZQsmGh7OS-XaOhMotYoTCR5Nb5SnF8paDWCGx" />
            <span className="font-display text-headline-md text-primary tracking-tighter">toolbox</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="group relative">
              <span className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-body-lg text-body-lg flex items-center gap-1 cursor-pointer py-4">
                Categories <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
              </span>
              <div className="absolute top-full left-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 glass-modal p-2 flex flex-col gap-1 translate-y-2 group-hover:translate-y-0">
                <Link href="/dashboard" className="px-4 py-2 hover:bg-white/5 rounded text-sm text-on-surface-variant hover:text-primary">All Tools</Link>
                <Link href="/category/image" className="px-4 py-2 hover:bg-white/5 rounded text-sm text-on-surface-variant hover:text-primary">Image Tools</Link>
                <Link href="/category/pdf" className="px-4 py-2 hover:bg-white/5 rounded text-sm text-on-surface-variant hover:text-primary">PDF Tools</Link>
                <Link href="/category/video" className="px-4 py-2 hover:bg-white/5 rounded text-sm text-on-surface-variant hover:text-primary">Video Tools</Link>
                <Link href="/category/audio" className="px-4 py-2 hover:bg-white/5 rounded text-sm text-on-surface-variant hover:text-primary">Audio Tools</Link>
              </div>
            </div>
            <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-body-lg text-body-lg" href="/dashboard">Tools</Link>
            
            {/* GitHub Stars Embed */}
            <iframe 
              src="https://ghbtns.com/github-btn.html?user=pratyakshkwatra&repo=toolbox&type=star&count=true&size=large" 
              frameBorder="0" 
              scrolling="0" 
              width="170" 
              height="30" 
              title="GitHub"
              className="ml-2"
            ></iframe>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="hidden md:flex w-10 h-10 items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95 bg-transparent rounded-full hover:bg-white/5"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link href="/dashboard" className="hidden md:inline-flex bg-primary-container text-on-primary font-bold px-5 py-2 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all inner-glow">
              Open Dashboard
            </Link>
            <button 
              className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-surface-container border-b border-white/10 p-4 flex flex-col gap-4">
            <Link href="/dashboard" className="text-on-surface hover:text-primary font-medium p-2">Tools Dashboard</Link>
            <Link href="/category/image" className="text-on-surface-variant hover:text-primary font-medium p-2 pl-4 border-l border-white/10">Image Tools</Link>
            <Link href="/category/pdf" className="text-on-surface-variant hover:text-primary font-medium p-2 pl-4 border-l border-white/10">PDF Tools</Link>
            <a href="https://github.com/pratyakshkwatra/toolbox" className="text-on-surface-variant hover:text-primary font-medium p-2">Documentation</a>
            <button 
              className="flex items-center justify-start gap-2 p-2 text-on-surface-variant hover:text-primary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span> Theme
            </button>
          </div>
        )}
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="px-margin-desktop max-w-container-max mx-auto mb-stack-xl mt-8">
          <div className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] py-16 sm:py-24 px-6 md:px-12 bg-surface-container-lowest/50 border border-white/5 text-center shadow-2xl">
            <div className="absolute -z-10 top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTih3pu0yeJ7bku_Hskl3h65008QTTU3XjnEzTRbuxd4L0VizM_MtBk4uJaCmEa-oxjEnw8y_b_MuM7BvcKY8RBHP14LX_dQIDCJDhoqNxSl-IUh6sEfMXazxveaCt6_z_X3hPQY09dtl8TlajnfUY00g23oD0xPlrTTdiDTNAQ7OoKMph9yIrpV-uNHG7qaRjGO3YvVmEOz0NByxZMXcHtC-9E8yjOcYBeBX9tJ1EbXg9fKZDQyJUK-H3kmibBLCemIDZlVtOswaN" alt="Toolbox Hero Illustration" className="w-full h-full object-cover mix-blend-overlay" />
            </div>
            
            <h1 className="font-display text-display mb-stack-md text-on-surface max-w-4xl mx-auto leading-tight relative z-10">
              Every file tool you&apos;ll ever need. <br className="hidden md:block"/> <span className="text-primary">Free. Open. Private.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg relative z-10">
              A premium suite of web utilities for documents, images, and media. No registration, no tracking, just speed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-stack-md relative z-10">
              <Link href="/dashboard" className="w-full sm:w-auto bg-primary text-on-primary font-bold px-8 py-4 rounded-full text-body-lg inner-glow active:scale-95 transition-all shadow-lg shadow-primary/20 text-center hover:scale-105">
                Open Dashboard
              </Link>
              <a href="https://github.com/pratyakshkwatra/toolbox" className="w-full sm:w-auto bg-surface-container-high border border-white/10 text-on-surface hover:bg-surface-container-highest font-bold px-8 py-4 rounded-full text-body-lg active:scale-95 transition-all text-center">
                View on GitHub
              </a>
            </div>
            {/* File Type Chips */}
            <div className="mt-stack-lg flex flex-wrap justify-center gap-stack-xs opacity-60 relative z-10">
              <span className="font-label-md text-label-md px-4 py-1.5 bg-surface-container rounded-full border border-white/5 shadow-sm">.PDF</span>
              <span className="font-label-md text-label-md px-4 py-1.5 bg-surface-container rounded-full border border-white/5 shadow-sm">.JPG</span>
              <span className="font-label-md text-label-md px-4 py-1.5 bg-surface-container rounded-full border border-white/5 shadow-sm">.MP4</span>
              <span className="font-label-md text-label-md px-4 py-1.5 bg-surface-container rounded-full border border-white/5 shadow-sm">.PNG</span>
              <span className="font-label-md text-label-md px-4 py-1.5 bg-surface-container rounded-full border border-white/5 shadow-sm">.WEBP</span>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="px-margin-desktop max-w-container-max mx-auto mb-stack-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {allCategories.map(cat => {
            const meta = categoryMeta[cat] || categoryMeta.image;
            return (
              <Link key={cat} href={`/category/${cat}`} className="glass-card p-stack-lg rounded-xl text-left flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-colors group">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${meta.colorClass}`}>
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">{meta.icon}</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">{meta.title}</h3>
                <p className="text-on-surface-variant font-body-sm text-body-sm">{meta.desc}</p>
              </Link>
            );
          })}
        </section>

        {/* Popular Tools Grid */}
        <section className="px-margin-desktop max-w-container-max mx-auto mb-stack-xl">
          <div className="flex items-center justify-between mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Popular Tools</h2>
            <Link className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline" href="/dashboard">
              View all 50+ tools
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {popularTools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="glass-card p-6 rounded-lg group flex flex-col justify-between cursor-pointer min-h-[140px]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tool.name}</h4>
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">call_made</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2 text-xs font-medium text-on-surface-variant/60">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    <span>{formatUsage(getToolScore(tool.slug))}</span>
                  </div>
                  <p className="text-on-surface-variant text-body-sm font-body-sm line-clamp-2">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="bg-surface-container py-stack-xl mb-stack-xl">
          <div className="px-margin-desktop max-w-container-max mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-label-md text-label-md mb-stack-md">
              <span className="material-symbols-outlined text-sm">lock</span>
              HYBRID ARCHITECTURE
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg max-w-2xl mx-auto">Privacy first. Local when possible, secure when not.</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-stack-lg">
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">vpn_key</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Browser-native processing</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">code</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Open-source transparency</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">timer_off</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Automatic deletion after 1 hour</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">shield</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Secure HTTPS processing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-margin-desktop max-w-container-max mx-auto mb-stack-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="glass-card p-stack-lg rounded-xl bg-primary/5 flex flex-col justify-end min-h-[300px]">
              <span className="material-symbols-outlined text-primary text-5xl mb-4">bolt</span>
              <h3 className="font-headline-lg text-headline-lg mb-2">Lightning Fast</h3>
              <p className="text-on-surface-variant">Engineered for performance with modern browser technologies. Processing happens at the speed of your hardware.</p>
            </div>
            <div className="grid grid-rows-2 gap-gutter">
              <div className="glass-card p-stack-md rounded-xl flex items-center gap-6">
                <div className="bg-surface-container-high p-4 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-3xl">layers</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-1">Batch Processing</h4>
                  <p className="text-on-surface-variant text-body-sm">Handle up to 10 files at once with zero lag.</p>
                </div>
              </div>
              <div className="glass-card p-stack-md rounded-xl flex items-center gap-6">
                <div className="bg-surface-container-high p-4 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-3xl">salinity</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-1">No Daily Limits</h4>
                  <p className="text-on-surface-variant text-body-sm">Use it as much as you want. Always free.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-stack-md rounded-xl mt-gutter flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-surface-container-high p-4 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-3xl">devices</span>
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md mb-1">Cross Platform</h4>
                <p className="text-on-surface-variant text-body-sm">Optimized for Desktop, Tablet, and Mobile browsers.</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 opacity-40">
              <span className="material-symbols-outlined">window</span>
              <span className="material-symbols-outlined">apps</span>
              <span className="material-symbols-outlined">android</span>
              <span className="material-symbols-outlined">terminal</span>
            </div>
          </div>
        </section>

        {/* Final CTA Area */}
        <section className="px-margin-desktop max-w-container-max mx-auto my-16">
          <div className="relative overflow-hidden rounded-[32px] py-16 px-6 md:px-12 bg-gradient-to-br from-primary-container/20 to-surface-container-highest border border-white/5 text-center shadow-2xl shadow-primary/5">
            <h2 className="font-display text-[40px] font-bold text-on-surface mb-6">Ready to start optimizing?</h2>
            <p className="text-on-surface-variant font-body-lg max-w-xl mx-auto mb-10 text-lg">Join thousands of developers and creators who use Toolbox for their daily file operations.</p>
            <Link href="/dashboard" className="bg-primary text-on-primary font-bold px-12 py-5 rounded-full text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all inner-glow inline-block hover:scale-105">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg border-t border-white/5 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-stack-md">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">handyman</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">toolbox.pratyakshkwatra.com</span>
            </div>
          </div>
          <div className="flex gap-8">
            <a className="font-caption text-caption text-on-secondary-container hover:text-primary underline transition-opacity hover:opacity-80 flex items-center gap-1" href="https://github.com/pratyakshkwatra/toolbox"><span className="material-symbols-outlined text-sm">code</span> GitHub Repository</a>
            <a className="font-caption text-caption text-on-secondary-container hover:text-primary underline transition-opacity hover:opacity-80" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a className="font-caption text-caption text-on-secondary-container hover:text-primary underline transition-opacity hover:opacity-80" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
          <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant/40">
            <span className="material-symbols-outlined text-sm">circle</span>
            <span className="">SYSTEM STATUS: OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </>
  );
}
