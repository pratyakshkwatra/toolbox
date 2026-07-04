"use client";

import React, { useState } from 'react';

interface ShareWidgetProps {
  url: string;
  title: string;
  text: string;
}

export function ShareWidget({ url, title, text }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 bg-surface-container-low p-2 rounded-lg border border-white/5 w-fit">
      <span className="text-on-surface-variant font-label-md mr-2 text-sm">Share:</span>
      
      <button 
        onClick={shareToTwitter}
        className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors"
        title="Share on X (Twitter)"
      >
        <span className="material-symbols-outlined text-[16px]">share</span>
      </button>

      <button 
        onClick={shareToLinkedIn}
        className="w-8 h-8 rounded-full bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center hover:bg-[#0077B5]/20 transition-colors"
        title="Share on LinkedIn"
      >
        <span className="material-symbols-outlined text-[16px]">business_center</span>
      </button>

      <button 
        onClick={nativeShare}
        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
        title={copied ? "Copied!" : "Copy Link"}
      >
        <span className="material-symbols-outlined text-[16px]">
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    </div>
  );
}
