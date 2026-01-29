"use client";

import Image from "next/image";
import { PropsWithChildren, useRef, useEffect } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {/* Animated background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background-subtle)] to-[var(--background-elevated)]" />

        {/* Animated orbs - cyan and purple */}
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-[var(--primary)]/10 blur-[100px]" />
        <div
          className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/8 blur-[120px]"
          style={{ animation: "pulse 4s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-[80px]"
          style={{ animation: "pulse 6s ease-in-out 1s infinite alternate" }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Diagonal accent lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" stroke="white" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-0">

        {/* Left side - Brand showcase with animated logo */}
        <section className="hidden flex-col items-center justify-center lg:flex">
          <div className="relative flex flex-col items-center">
            {/* Decorative ring behind logo */}
            <div className="absolute -inset-16 rounded-full border border-[var(--primary)]/10" />
            <div
              className="absolute -inset-24 rounded-full border border-[var(--accent)]/10"
              style={{ animation: "spin 60s linear infinite" }}
            />
            <div
              className="absolute -inset-32 rounded-full border border-[var(--primary)]/5"
              style={{ animation: "spin 90s linear infinite reverse" }}
            />

            {/* Glowing accent dots on rings */}
            <div
              className="absolute -top-24 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_20px_rgba(34,211,238,0.6)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-32 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              style={{ animation: "pulse 2.5s ease-in-out 0.5s infinite" }}
            />

            {/* Animated Logo Video Container */}
            <div className="auth-video-container">
              {/* Ambient glow behind video */}
              <div className="auth-video-glow" />

              {/* Glass frame */}
              <div className="auth-video-frame">
                <div className="auth-video-frame-inner" />
                <video
                  ref={videoRef}
                  src="/Animate_this_make_1080p_202512282238.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="auth-video"
                />
              </div>

              {/* Decorative corner accents */}
              <div className="auth-video-corner auth-video-corner--tl" />
              <div className="auth-video-corner auth-video-corner--tr" />
              <div className="auth-video-corner auth-video-corner--bl" />
              <div className="auth-video-corner auth-video-corner--br" />
            </div>

            {/* Tagline */}
            <div className="mt-12 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-[var(--primary)]">
                Secure Wallet Management
              </p>
              <p className="mt-3 text-[var(--text-secondary)]">
                Enterprise-grade financial administration
              </p>
            </div>

            {/* Feature badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {["256-bit Encryption", "Real-time Analytics", "24/7 Monitoring"].map((feature, i) => (
                <span
                  key={feature}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-sm transition-all hover:border-[var(--border-accent)] hover:text-[var(--primary)]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Right side - Auth form */}
        <section className="flex w-full items-center justify-center lg:justify-center">
          {/* Mobile logo - still image for performance */}
          <div className="absolute left-6 top-6 lg:hidden">
            <Image
              src="/logo.jpeg"
              alt="Inspire Alliance"
              width={140}
              height={50}
              className="h-auto w-32"
              priority
            />
          </div>

          {children}
        </section>
      </div>

      {/* Corner accents */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 border-b border-l border-[var(--primary)]/10" />
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 border-r border-t border-[var(--accent)]/10" />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
