"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import toolsConfig from "@/config/tools.json";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    if (categoryParam) {
      const validCategories = ["pdf", "image", "video", "audio"];
      if (validCategories.includes(categoryParam.toLowerCase())) {
        setActiveCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase());
      }
    }
  }, [categoryParam]);



  const categories = ["All", "PDF", "Image", "Video", "Audio"];
  


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
    return analyticsData[slug] || 0;
  };

  const formatUsage = (score: number) => {
    if (isLoadingAnalytics) return "...";
    if (score === 0) return "New tool!";
    if (score >= 100000) return `${Math.floor(score / 1000)}k+ users`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k+ users`;
    return `${score} users`;
  };

  const filteredTools = (activeCategory === "All" 
    ? toolsConfig 
    : toolsConfig.filter(t => t.category.toLowerCase() === activeCategory.toLowerCase()))
    .sort((a, b) => getToolScore(b.slug) - getToolScore(a.slug));

  return (
    <>
      {/* Hero / Recently Used */}
      <section className="mb-stack-xl">
        <div className="flex justify-between items-end mb-stack-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Recently Used</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant opacity-60">Pick up right where you left off</p>
          </div>
          <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="flex gap-stack-md overflow-x-auto pb-4 custom-scrollbar">
          {/* Recent Card 1 */}
          <Link href="/tools/pdf-merge" className="min-w-[280px] glass-card p-stack-md rounded-xl flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md font-bold">Merge PDFs</h3>
              <p className="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-tighter">2 hours ago</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-on-surface-variant/30 text-[18px]">chevron_right</span>
          </Link>
          {/* Recent Card 2 */}
          <Link href="/tools/image-compress" className="min-w-[280px] glass-card p-stack-md rounded-xl flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">image</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md font-bold">Image Compress</h3>
              <p className="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-tighter">Yesterday</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-on-surface-variant/30 text-[18px]">chevron_right</span>
          </Link>
          {/* Recent Card 3 */}
          <Link href="/tools/video-trim" className="min-w-[280px] glass-card p-stack-md rounded-xl flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
              <span className="material-symbols-outlined">movie</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md font-bold">Trim Video</h3>
              <p className="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-tighter">3 days ago</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-on-surface-variant/30 text-[18px]">chevron_right</span>
          </Link>
        </div>
      </section>

      {/* Main Tools Grid */}
      <section>
        <div className="flex items-center gap-stack-md mb-stack-lg border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-label-md text-label-md pb-4 -mb-[18px] whitespace-nowrap transition-all ${activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
            >
              {cat === "All" ? "All Tools" : cat}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {filteredTools.map((tool: any) => {
            return (
              <Link href={`/tools/${tool.slug}`} key={tool.slug} className="glass-card p-6 rounded-xl relative group block flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl">
                    {tool.icon}
                  </div>
                  <div className="flex gap-2">
                    {['pdf-merge', 'image-compress', 'video-trim'].includes(tool.slug) && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary-container/20 text-tertiary uppercase tracking-wider">Popular</span>
                    )}
                    {(tool as any).execution === 'local' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">lock</span> Local</span>
                    )}
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-1 text-on-surface group-hover:text-primary transition-colors">{tool.name}</h3>
                <div className="flex items-center gap-1 mb-4 text-xs font-medium text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-[14px]">group</span>
                  <span>{formatUsage(getToolScore(tool.slug))}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant/70 mb-6 flex-grow">{tool.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="font-label-md text-[11px] text-on-surface-variant/40 font-medium bg-surface-container px-2 py-1 rounded">.{tool.category.toUpperCase()}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
