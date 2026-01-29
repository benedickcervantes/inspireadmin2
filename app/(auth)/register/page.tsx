"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminRegister } from "@/lib/api/adminAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = emailAddress.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setError("Enter your name and email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = await adminRegister({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        emailAddress: trimmedEmail,
        password,
        confirmPassword,
      });

      const token = payload.data?.token;
      if (!token) {
        throw new Error("Registration response missing token.");
      }

      localStorage.setItem("authToken", token);
      if (payload.data?.user) {
        localStorage.setItem("authUser", JSON.stringify(payload.data.user));
      }

      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputWrapper = ({
    children,
    focused,
  }: {
    children: React.ReactNode;
    focused: boolean;
  }) => (
    <div
      className={`relative rounded-xl transition-all duration-300 ${focused ? "ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#0a0f1a]" : ""
        }`}
    >
      {children}
    </div>
  );

  return (
    <div className="w-full max-w-md animate-fadeIn">
      {/* Card with glass morphism */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Gradient overlay on card */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Admin Portal
            </p>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="text-sm leading-relaxed text-slate-400">
            Register a new admin profile to access approvals, analytics, and system controls.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
                <svg className="h-3 w-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="relative mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                First name
              </label>
              <InputWrapper focused={focusedField === "firstName"}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className={`h-5 w-5 transition-colors duration-300 ${focusedField === "firstName" ? "text-cyan-400" : "text-slate-500"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (error) setError("");
                  }}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Jane"
                  autoComplete="given-name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] focus:border-cyan-400/50 focus:bg-white/[0.08]"
                />
              </InputWrapper>
            </div>

            {/* Last name */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last name
              </label>
              <InputWrapper focused={focusedField === "lastName"}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className={`h-5 w-5 transition-colors duration-300 ${focusedField === "lastName" ? "text-cyan-400" : "text-slate-500"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (error) setError("");
                  }}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] focus:border-cyan-400/50 focus:bg-white/[0.08]"
                />
              </InputWrapper>
            </div>
          </div>

          {/* Email field */}
          <div className="group relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email address
            </label>
            <InputWrapper focused={focusedField === "email"}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className={`h-5 w-5 transition-colors duration-300 ${focusedField === "email" ? "text-cyan-400" : "text-slate-500"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
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
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] focus:border-cyan-400/50 focus:bg-white/[0.08]"
              />
            </InputWrapper>
          </div>

          {/* Password field */}
          <div className="group relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <InputWrapper focused={focusedField === "password"}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className={`h-5 w-5 transition-colors duration-300 ${focusedField === "password" ? "text-cyan-400" : "text-slate-500"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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
                placeholder="Create a password"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] focus:border-cyan-400/50 focus:bg-white/[0.08]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-colors hover:text-slate-300"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </InputWrapper>
            <p className="mt-2 text-xs text-slate-500">Minimum 6 characters</p>
          </div>

          {/* Confirm password field */}
          <div className="group relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirm password
            </label>
            <InputWrapper focused={focusedField === "confirmPassword"}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className={`h-5 w-5 transition-colors duration-300 ${focusedField === "confirmPassword" ? "text-cyan-400" : "text-slate-500"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] focus:border-cyan-400/50 focus:bg-white/[0.08]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-colors hover:text-slate-300"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </InputWrapper>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer link */}
        <div className="relative mt-8 flex items-center justify-center gap-2 text-sm">
          <span className="text-slate-500">Already have access?</span>
          <Link
            href="/login"
            className="group relative font-semibold text-amber-400 transition-colors hover:text-amber-300"
          >
            Sign in
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
