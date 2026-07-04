import type { Metadata } from "next";
import toolsConfig from "@/config/tools.json";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = toolsConfig.find(t => t.slug === params.slug);
  
  if (!tool) {
    return {
      title: "Tool Not Found - Toolbox",
    };
  }

  return {
    title: `${tool.name} - Free Online Tool | Toolbox`,
    description: tool.description,
    keywords: [tool.name, tool.category, "free tool", "online tool", "privacy-first", "toolbox"],
    openGraph: {
      title: `${tool.name} - Free Online Tool | Toolbox`,
      description: tool.description,
    }
  };
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
