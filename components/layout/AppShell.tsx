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
      <Sidebar
        expanded={isSidebarExpanded}
        onToggle={handleToggleSidebar}
        user={userDisplay}
        onLogout={handleLogout}
      />

      <div className="app-content-area">
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
