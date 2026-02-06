"use client";

import React, { useState } from "react";
import { Button, Stack } from "rsuite";
import HeaderDrawers from "./HeaderDrawers";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ChevronDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Download: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
};

export default function Header() {
  const [sessionsDrawerOpen, setSessionsDrawerOpen] = useState(false);
  const [requestsDrawerOpen, setRequestsDrawerOpen] = useState(false);
  const [reviewsDrawerOpen, setReviewsDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-semibold text-[var(--primary)]">
              IA
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Dashboard Overview</div>
              <div className="text-xs text-[var(--text-muted)]">Updated a few seconds ago</div>
            </div>
          </div>

          <Stack direction="row" spacing={8} className="flex-wrap">
            <Button size="sm" appearance="default" className="!h-8 !px-3 !rounded-md !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface)] !shadow-none hover:!bg-[var(--surface-hover)] hover:!border-[var(--border-strong)]">
              <span className="flex items-center gap-2">
                <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                Feb 2025
                <Icons.ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </span>
            </Button>
            
          </Stack>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div 
            onClick={() => setSessionsDrawerOpen(true)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-2 transition-all hover:border-[var(--border)] hover:bg-[var(--surface-hover)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="text-[11px] text-[var(--text-muted)]">Active Sessions</div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">128</div>
          </div>
          <div 
            onClick={() => setRequestsDrawerOpen(true)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-2 transition-all hover:border-[var(--border)] hover:bg-[var(--surface-hover)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="text-[11px] text-[var(--text-muted)]">New Requests</div>
            <div className="text-[13px] font-semibold text-[var(--primary)]">24</div>
          </div>
          <div 
            onClick={() => setReviewsDrawerOpen(true)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-2 transition-all hover:border-[var(--border)] hover:bg-[var(--surface-hover)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="text-[11px] text-[var(--text-muted)]">Pending Reviews</div>
            <div className="text-[13px] font-semibold text-[var(--accent)]">8</div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <HeaderDrawers
        sessionsDrawerOpen={sessionsDrawerOpen}
        setSessionsDrawerOpen={setSessionsDrawerOpen}
        requestsDrawerOpen={requestsDrawerOpen}
        setRequestsDrawerOpen={setRequestsDrawerOpen}
        reviewsDrawerOpen={reviewsDrawerOpen}
        setReviewsDrawerOpen={setReviewsDrawerOpen}
      />
    </>
  );
}
