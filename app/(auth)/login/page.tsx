"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/walletAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.replace("/dashboard");
      return;
    }
    const message = searchParams.get("message");
    if (message) setError(decodeURIComponent(message));
  }, [router, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = emailAddress.trim();

    if (!trimmedEmail || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const { access_token, user } = await login(trimmedEmail, password);

      if (user.role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authUser", JSON.stringify(user));
      router.replace("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fadeIn">
      {/* Card with glass morphism */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Gradient overlay on card */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
              Admin Portal
            </p>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome back
          </h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Sign in to manage approvals, users, and real-time wallet activity.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--danger)]/5 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/20">
                <svg className="h-3 w-3 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-[var(--danger)]">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="relative mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="group relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Email address
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focusedField === "email"
              ? "ring-2 ring-[var(--primary)]/50 ring-offset-2 ring-offset-[var(--background)]"
              : ""
              }`}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === "email" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="name@company.com"
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] focus:border-[var(--primary)]/50 focus:bg-[var(--surface-hover)]"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="group relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Password
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focusedField === "password"
              ? "ring-2 ring-[var(--primary)]/50 ring-offset-2 ring-offset-[var(--background)]"
              : ""
              }`}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === "password" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pl-12 pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] focus:border-[var(--primary)]/50 focus:bg-[var(--surface-hover)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] font-semibold text-[var(--background)] shadow-lg shadow-[var(--primary)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-strong)] to-[var(--accent-strong)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer link */}
        <div className="relative mt-8 flex items-center justify-center gap-2 text-sm">
          <span className="text-[var(--text-muted)]">New to Inspire Admin?</span>
          <Link
            href="/register"
            className="group relative font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-strong)]"
          >
            Create account
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
