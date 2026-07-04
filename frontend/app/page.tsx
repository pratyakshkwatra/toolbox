import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-surface max-w-[1200px] mx-auto">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm lg:flex">
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24 bg-surface">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col text-center">
        <h1 className="text-display font-bold mb-4 tracking-tight">
          Toolbox <span className="text-primary-container">.</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mb-8">
          A privacy-first, blazing fast collection of file utilities. 
          Everything runs instantly and your files are never saved.
        </p>

        <div className="w-full max-w-2xl mb-12 relative">
          <input 
            type="text" 
            placeholder="Search 50+ tools..." 
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-full px-6 py-4 text-on-surface focus:border-primary-container focus:outline-none text-lg backdrop-blur-sm"
          />
          <span className="absolute right-6 top-4 text-xl">🔍</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {filteredTools.map((tool: { slug: string, icon: React.ReactNode, name: string, description: string }) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="glass-card p-6 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
              <div className="absolute top-4 left-4 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                ☁️ Server-Side
              </div>
              <div className="w-16 h-16 bg-surface-bright rounded-2xl flex items-center justify-center mb-4 mt-6 text-3xl group-hover:bg-primary-container transition-colors shadow-lg">
                {tool.icon}
              </div>
              <h2 className="text-headline-sm font-semibold mb-2">{tool.name}</h2>
              <p className="text-on-surface-variant text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
