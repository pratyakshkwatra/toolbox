"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<{id: string, tool: string, created_at: string, status: string}[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-8 md:p-24 bg-surface max-w-[1200px] mx-auto">
      <h1 className="text-display font-bold mb-2">Dashboard</h1>
      <p className="text-body-lg text-on-surface-variant mb-12">
        Welcome back, <span className="text-primary-container">{session.user?.email}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-headline-sm font-semibold border-b border-white/10 pb-2">Recent Processing History</h2>
          
          {history.length === 0 ? (
            <div className="glass-card p-12 text-center text-on-surface-variant">
              <p>You haven't processed any files yet.</p>
              <Link href="/" className="text-primary-container hover:underline mt-2 inline-block">
                Try out a tool
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((job) => (
                <div key={job.id} className="glass-card p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{job.tool}</h4>
                    <p className="text-xs text-on-surface-variant font-mono">{new Date(job.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-surface-bright'}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-headline-sm font-semibold border-b border-white/10 pb-2">Quick Actions</h2>
          <div className="glass-card p-6 flex flex-col gap-4">
            <Link href="/tools/pdf-merge" className="btn-secondary text-center w-full py-2">Merge PDFs</Link>
            <Link href="/tools/image-compress" className="btn-secondary text-center w-full py-2">Compress Image</Link>
            <Link href="/tools/video-trim" className="btn-secondary text-center w-full py-2">Trim Video</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
