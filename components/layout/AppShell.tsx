"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
  const [customUsername, setCustomUsername] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState<string | null>(null);

  useEffect(() => {
    // Listen for username and email changes
    const handleStorageChange = () => {
      const username = localStorage.getItem("adminUsername");
      const email = localStorage.getItem("adminEmail");
      setCustomUsername(username);
      setCustomEmail(email);
    };

    // Initial load
    handleStorageChange();

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Custom events for same-tab updates
    window.addEventListener("usernameChanged", handleStorageChange);
    window.addEventListener("emailChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usernameChanged", handleStorageChange);
      window.removeEventListener("emailChanged", handleStorageChange);
    };
  }, []);

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
    // Use custom username and email from state if available
    const displayEmail = customEmail || authUser?.emailAddress;
    
    if (customUsername) {
      return { 
        label: customUsername, 
        secondary: displayEmail, 
        initials: getInitials(authUser) 
      };
    }
    
    const fullName = [authUser?.firstName, authUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const label = fullName || displayEmail || "Admin";
    const secondary = fullName ? displayEmail : undefined;
    return { label, secondary, initials: getInitials(authUser) };
  }, [authUser, customUsername, customEmail]);

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

      {/* Mobile Sidebar Overlay with Animation */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/50"
            style={{ zIndex: 1200 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          expanded={isSidebarExpanded}
          onToggle={handleToggleSidebar}
          user={userDisplay}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar with Fade Animation */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed overflow-hidden"
            style={{ top: '56px', left: 0, bottom: 0, width: '280px', zIndex: 1250 }}
          >
            <div className="h-full overflow-y-auto">
              <Sidebar
                expanded={true}
                onToggle={() => setIsMobileSidebarOpen(false)}
                user={userDisplay}
                onLogout={handleLogout}
                onNavigate={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
