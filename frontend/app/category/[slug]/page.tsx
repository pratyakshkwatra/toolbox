"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import toolsConfig from "@/config/tools.json";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug.toLowerCase();
  const validCategories = ["pdf", "image", "video", "audio"];
  
  if (!validCategories.includes(categorySlug)) {
    notFound();
  }

  const categoryTitle = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
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

  const filteredTools = toolsConfig
    .filter(t => t.category.toLowerCase() === categorySlug)
    .sort((a, b) => getToolScore(b.slug) - getToolScore(a.slug));



  const formatUsage = (score: number) => {
    if (isLoadingAnalytics) return "...";
    if (score === 0) return "New tool!";
    if (score >= 100000) return `${Math.floor(score / 1000)}k+ users`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k+ users`;
    return `${score} users`;
  };

  return (
    <main className="min-h-screen pt-32 pb-16 px-margin-desktop max-w-container-max mx-auto">
      <div className="mb-stack-xl">
        <Link href="/" className="text-on-surface-variant hover:text-on-surface mb-8 flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Home
        </Link>
        <h1 className="font-display text-display text-on-surface mb-4">{categoryTitle} Tools</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Explore all our free and private {categorySlug} utilities. Select a tool below to open its interactive workspace.
        </p>
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
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">lock</span> Local
                    </span>
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
    </main>
  );
}
