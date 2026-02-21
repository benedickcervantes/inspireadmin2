"use client";

import React from "react";
import { Drawer } from "rsuite";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Bell: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Monitor: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Smartphone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

interface HeaderDrawersProps {
  sessionsDrawerOpen: boolean;
  setSessionsDrawerOpen: (open: boolean) => void;
  requestsDrawerOpen: boolean;
  setRequestsDrawerOpen: (open: boolean) => void;
  reviewsDrawerOpen: boolean;
  setReviewsDrawerOpen: (open: boolean) => void;
}

export default function HeaderDrawers({
  sessionsDrawerOpen,
  setSessionsDrawerOpen,
  requestsDrawerOpen,
  setRequestsDrawerOpen,
  reviewsDrawerOpen,
  setReviewsDrawerOpen,
}: HeaderDrawersProps) {
  const router = useRouter();

  const handleNavigate = (path: string, closeDrawer: () => void) => {
    router.push(path);
    closeDrawer();
  };

  return (
    <>
      {/* Active Sessions Drawer */}
      <Drawer
        open={sessionsDrawerOpen}
        onClose={() => setSessionsDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
        closeButton={false}
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Active Sessions</h3>
            <button
              onClick={() => setSessionsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Total Active Sessions</div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">128</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--primary)]">+12</span> from last hour
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icons.Users className="w-7 h-7 text-[var(--primary)]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">Session Types</h4>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icons.Monitor className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Desktop</div>
                      <div className="text-xs text-[var(--text-muted)]">Web browsers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">85</div>
                    <div className="text-xs text-[var(--text-muted)]">66%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                      <Icons.Smartphone className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Mobile</div>
                      <div className="text-xs text-[var(--text-muted)]">iOS & Android</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">43</div>
                    <div className="text-xs text-[var(--text-muted)]">34%</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Avg Session Duration</span>
                  <span className="font-semibold text-[var(--text-primary)]">24 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Peak Time</span>
                  <span className="font-semibold text-[var(--text-primary)]">2:00 PM</span>
                </div>
                <div className="h-px bg-[var(--border-subtle)] my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">New Today</span>
                  <span className="font-semibold text-[var(--success)]">+32</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>

      {/* New Requests Drawer - Similar structure */}
      <Drawer
        open={requestsDrawerOpen}
        onClose={() => setRequestsDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
        closeButton={false}
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">New Requests</h3>
            <button
              onClick={() => setRequestsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">New Requests</div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">24</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--primary)]">+8</span> from yesterday
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icons.Bell className="w-7 h-7 text-[var(--primary)]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">Request Types</h4>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleNavigate('/deposit-request', () => setRequestsDrawerOpen(false))}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center">
                      <Icons.FileText className="w-5 h-5 text-[var(--success)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Deposits</div>
                      <div className="text-xs text-[var(--text-muted)]">New deposit requests</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">12</div>
                    <div className="text-xs text-[var(--text-muted)]">50%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleNavigate('/withdrawal-request', () => setRequestsDrawerOpen(false))}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center">
                      <Icons.AlertCircle className="w-5 h-5 text-[var(--warning)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Withdrawals</div>
                      <div className="text-xs text-[var(--text-muted)]">Pending withdrawals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">7</div>
                    <div className="text-xs text-[var(--text-muted)]">29%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleNavigate('/kyc-requests', () => setRequestsDrawerOpen(false))}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                      <Icons.CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">KYC</div>
                      <div className="text-xs text-[var(--text-muted)]">Verification requests</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">5</div>
                    <div className="text-xs text-[var(--text-muted)]">21%</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Avg Response Time</span>
                  <span className="font-semibold text-[var(--text-primary)]">2.5 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Oldest Request</span>
                  <span className="font-semibold text-[var(--text-primary)]">6 hrs ago</span>
                </div>
                <div className="h-px bg-[var(--border-subtle)] my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Urgent</span>
                  <span className="font-semibold text-[var(--danger)]">3</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>

      {/* Pending Reviews Drawer */}
      <Drawer
        open={reviewsDrawerOpen}
        onClose={() => setReviewsDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
        closeButton={false}
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Pending Reviews</h3>
            <button
              onClick={() => setReviewsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Pending Reviews</div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">8</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--accent)]">+2</span> from yesterday
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                  <Icons.Clock className="w-7 h-7 text-[var(--accent)]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">Review Types</h4>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center">
                      <Icons.AlertCircle className="w-5 h-5 text-[var(--warning)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">High Priority</div>
                      <div className="text-xs text-[var(--text-muted)]">Urgent reviews</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">3</div>
                    <div className="text-xs text-[var(--text-muted)]">38%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icons.Clock className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Normal Priority</div>
                      <div className="text-xs text-[var(--text-muted)]">Standard reviews</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">5</div>
                    <div className="text-xs text-[var(--text-muted)]">62%</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Avg Review Time</span>
                  <span className="font-semibold text-[var(--text-primary)]">45 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Completed Today</span>
                  <span className="font-semibold text-[var(--text-primary)]">12</span>
                </div>
                <div className="h-px bg-[var(--border-subtle)] my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Overdue</span>
                  <span className="font-semibold text-[var(--danger)]">1</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
