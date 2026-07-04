"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      // Register
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        alert("Failed to register. Email may exist.");
        return;
      }
      // Auto login after register
      signIn("credentials", { email, password, redirect: false });
      setShowLogin(false);
    } else {
      // Login
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        alert("Invalid credentials");
      } else {
        setShowLogin(false);
      }
    }
  };

  return (
    <>
      <nav className="w-full border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Toolbox <span className="text-primary-container">.</span>
          </Link>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-on-surface hover:text-primary-container transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm font-medium text-error hover:brightness-110 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="btn-primary px-4 py-2 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-card p-8 w-full max-w-md relative">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-headline-md font-bold mb-6">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded px-4 py-2 text-on-surface focus:border-primary-container focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded px-4 py-2 text-on-surface focus:border-primary-container focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                {isRegistering ? "Sign Up" : "Sign In"}
              </button>
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-on-surface-variant hover:text-white mt-2"
              >
                {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
