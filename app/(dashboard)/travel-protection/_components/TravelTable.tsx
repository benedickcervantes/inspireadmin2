"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getTravelApplications } from "@/lib/api/subcollections";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  MoreHorizontal: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Copy: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  MapPin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Hash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
};

interface TravelApplication {
  _firebaseDocId: string;
  userId?: string;
  destination?: string;
  travelDate?: string;
  status?: string;
  coverage?: string;
  premium?: number;
  createdAt?: string;
  policyType?: string;
  startDate?: string;
  endDate?: string;
  user: {
    odId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    accountNumber?: string;
  };
  [key: string]: unknown;
}

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const getFullName = (user: TravelApplication['user']): string => {
  const first = user.firstName || '';
  const last = user.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

const getAvatarUrl = (user: TravelApplication['user']): string => {
  const name = getFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    active: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Active" },
    approved: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Approved" },
    completed: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Completed" },
    pending: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]", border: "border-[var(--warning)]/30", dot: "bg-[var(--warning)]", label: "Pending" },
    processing: { bg: "bg-[var(--info-soft)]", text: "text-[var(--info)]", border: "border-[var(--info)]/30", dot: "bg-[var(--info)]", label: "Processing" },
    expired: { bg: "bg-[var(--surface-soft)]", text: "text-[var(--text-muted)]", border: "border-[var(--border)]", dot: "bg-[var(--text-muted)]", label: "Expired" },
    cancelled: { bg: "bg-[var(--surface-soft)]", text: "text-[var(--text-muted)]", border: "border-[var(--border)]", dot: "bg-[var(--text-muted)]", label: "Cancelled" },
    claimed: { bg: "bg-[var(--accent-soft)]", text: "text-[var(--accent)]", border: "border-[var(--accent)]/30", dot: "bg-[var(--accent)]", label: "Claimed" },
    rejected: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", dot: "bg-[var(--danger)]", label: "Rejected" },
  };

  const statusLower = (status || 'pending').toLowerCase();
  const { bg, text, border, dot, label } = config[statusLower] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const CoverageBadge = ({ coverage }: { coverage?: string }) => {
  const displayCoverage = coverage || 'Standard';

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-medium">
      <Icons.Shield className="w-3 h-3" />
      {displayCoverage}
    </div>
  );
};

const ApplicationDetailPanel = ({ application, onClose }: { application: TravelApplication; onClose: () => void }) => {
  const userName = getFullName(application.user);
  const userAvatar = getAvatarUrl(application.user);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)] bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Travel Application Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{application._firebaseDocId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{userName}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{application.user.emailAddress || 'No email'}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <CoverageBadge coverage={application.coverage} />
            <StatusBadge status={application.status || 'pending'} />
          </div>
          {application.premium && (
            <div className="text-xl font-bold mt-2">₱{application.premium.toLocaleString()}</div>
          )}
          <div className="text-[11px] text-purple-100 mt-1">Premium Amount</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Application ID</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{application._firebaseDocId}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--accent-soft)] rounded-md border border-[var(--accent)]/20">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--accent)]/30 flex items-center justify-center">
              <Icons.MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--accent)] uppercase tracking-wide">Destination</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.destination || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Travel Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(application.travelDate || application.startDate)}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Account Number</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.user.accountNumber || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Application Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(application.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TravelTable() {
  const [selectedApplication, setSelectedApplication] = useState<TravelApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["travel-applications", { page, limit }],
    queryFn: () => getTravelApplications({ page, limit }),
    placeholderData: keepPreviousData,
  });

  const applications = (data?.data?.items ?? []) as TravelApplication[];
  const total = data?.data?.pagination.total ?? 0;
  const errorMessage = error instanceof Error ? error.message : "Failed to fetch travel applications";

  const handleRowClick = (application: TravelApplication) => {
    setSelectedApplication(application);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content="Loading travel applications..." className="!text-[var(--text-muted)]" />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-[var(--danger)] mb-2">Error loading travel applications</div>
        <div className="text-sm text-[var(--text-muted)] mb-4">{errorMessage}</div>
        <Button appearance="primary" className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)]" onClick={() => refetch()}>Retry</Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-x-auto">
          <Table
            data={applications}
            height={Math.max(applications.length * 60 + 40, 200)}
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[1000px] cursor-pointer"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as TravelApplication)}
          >
            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-xs font-mono font-medium text-[var(--text-primary)]">{rowData._firebaseDocId.substring(0, 10)}...</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={2} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Applicant</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => {
                  const userName = getFullName(rowData.user);
                  const userAvatar = getAvatarUrl(rowData.user);
                  return (
                    <div className="flex items-center gap-2.5">
                      <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-[var(--border)]" />
                      <div>
                        <div className="text-[13px] font-medium text-[var(--text-primary)]">{userName}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{rowData.user.emailAddress || 'No email'}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Destination</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{rowData.destination || 'N/A'}</span>
                )}
              </Cell>
            </Column>

            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Coverage</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <CoverageBadge coverage={rowData.coverage} />
                )}
              </Cell>
            </Column>

            <Column width={100} align="right">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Premium</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{rowData.premium ? `₱${rowData.premium.toLocaleString()}` : 'N/A'}</span>
                )}
              </Cell>
            </Column>

            <Column width={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => <StatusBadge status={rowData.status || 'pending'} />}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Travel Date</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-xs text-[var(--text-muted)]">{formatDate(rowData.travelDate || rowData.startDate)}</span>
                )}
              </Cell>
            </Column>

            <Column width={60} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">...</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <Dropdown
                    renderToggle={(props, ref) => (
                      <button {...props} ref={ref} className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]" onClick={(e) => e.stopPropagation()}>
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                    placement="bottomEnd"
                  >
                    <Dropdown.Item className="!text-xs" onClick={() => handleRowClick(rowData)}>
                      <span className="flex items-center gap-2"><Icons.Eye className="w-3.5 h-3.5" />View</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="!text-xs">
                      <span className="flex items-center gap-2"><Icons.Copy className="w-3.5 h-3.5" />Copy ID</span>
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-medium text-[var(--text-primary)]">{applications.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, total)}</span> of <span className="font-medium text-[var(--text-primary)]">{total}</span>
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            className="!text-xs dark-pagination"
          />
        </div>
      </motion.div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="sm" className="!w-[380px] dark-drawer">
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedApplication && (
              <motion.div
                key={selectedApplication._firebaseDocId}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                className="h-full"
              >
                <ApplicationDetailPanel application={selectedApplication} onClose={() => setDrawerOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
