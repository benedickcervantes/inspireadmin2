"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import ChatSystem from "@/components/chat";

type AuthUser = {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
};

const getInitials = (user: AuthUser | null) => {
  const first = user?.firstName?.trim();
  const last = user?.lastName?.trim();

  if (first || last) {
    const initials = `${first?.[0] || ""}${last?.[0] || ""}`.trim();
    return initials ? initials.toUpperCase() : "AD";
  }

  if (user?.emailAddress) {
    return user.emailAddress[0]?.toUpperCase() || "AD";
  }

  return "AD";
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return localStorage.getItem("adminSidebarExpanded") !== "0";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthorized(false);
      setAuthUser(null);
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);

    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse auth user:", error);
        setAuthUser(null);
      }
    } else {
      setAuthUser(null);
    }
  }, [router]);

  const userDisplay = useMemo(() => {
    const fullName = [authUser?.firstName, authUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const label = fullName || authUser?.emailAddress || "Admin";
    const secondary = fullName ? authUser?.emailAddress : undefined;
    return { label, secondary, initials: getInitials(authUser) };
  }, [authUser]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    setIsAuthorized(false);
    router.replace("/login");
  };

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("adminSidebarExpanded", next ? "1" : "0");
      return next;
    });
  };

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xs uppercase tracking-[0.35em] text-slate-500">
        Checking access
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="app-root">
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-transparent flex items-center px-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="w-10 h-10 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-primary)] transition-colors"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          expanded={isSidebarExpanded}
          onToggle={handleToggleSidebar}
          user={userDisplay}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar - Shown only on mobile when open */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Sidebar
              expanded={true}
              onToggle={() => setIsMobileSidebarOpen(false)}
              user={userDisplay}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      <div className="app-content-area md:pt-0 pt-14">
        <main className="app-main">
          <div className="app-panel">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Chat Support System */}
      <ChatSystem />
    </div>
  );
}
