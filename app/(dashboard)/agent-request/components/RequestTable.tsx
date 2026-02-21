"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getCollectionStub } from "@/lib/api/collectionStubs";

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
  Hash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
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
  Briefcase: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

interface AgentRequest {
  _firebaseDocId: string;
  userId?: string;
  userID?: string;
  fullName?: string;
  userName?: string;
  emailAddress?: string;
  agentNumber?: string;
  agentCode?: string;
  isApproved?: boolean;
  processedAt?: string | Date;
  requestType?: string;
  applicationDate?: string;
  datetimeRequest?: string | Date;
  createdAt?: string;
  submittedAt?: string;
  [key: string]: unknown;
}

interface RequestTableProps {
  searchQuery: string;
  statusFilter: string;
  dateRange: [Date, Date] | null;
}

// Helper functions
const formatDate = (dateValue?: string | Date): string => {
  if (!dateValue) return 'N/A';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateValue);
  }
};

const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=0a0e14&size=150`;
};

const StatusBadge = ({ isApproved, processedAt }: { isApproved?: boolean; processedAt?: string | Date }) => {
  let config = {
    bg: "bg-[var(--warning-soft)]",
    text: "text-[var(--warning)]",
    border: "border-[var(--warning)]/30",
    dot: "bg-[var(--warning)]",
    label: "Pending"
  };

  if (processedAt) {
    if (isApproved) {
      config = {
        bg: "bg-[var(--success-soft)]",
        text: "text-[var(--success)]",
        border: "border-[var(--success)]/30",
        dot: "bg-[var(--success)]",
        label: "Approved"
      };
    } else {
      config = {
        bg: "bg-[var(--danger-soft)]",
        text: "text-[var(--danger)]",
        border: "border-[var(--danger)]/30",
        dot: "bg-[var(--danger)]",
        label: "Rejected"
      };
    }
  }

  const { bg, text, border, dot, label } = config;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const RequestDetailPanel = ({ request, onClose }: { request: AgentRequest; onClose: () => void }) => {
  const userName = request.fullName || request.userName || 'Unknown User';
  const userAvatar = getAvatarUrl(userName);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Agent Request Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{request._firebaseDocId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary)]/30" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{userName}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{request.emailAddress || 'No email'}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--primary)] to-blue-500 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/20 text-[11px] font-medium">
              <Icons.Briefcase className="w-3 h-3" />
              Agent Request
            </div>
            <StatusBadge isApproved={request.isApproved} processedAt={request.processedAt} />
          </div>
          {request.agentCode && (
            <div className="text-xl font-bold mt-2">{request.agentCode}</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Request ID</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{request._firebaseDocId}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Applicant Name</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{userName}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Email Address</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{request.emailAddress || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Submitted Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(request.datetimeRequest || request.submittedAt || request.applicationDate || request.createdAt)}</div>
            </div>
          </div>

          {request.agentNumber && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <Icons.Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Agent Number</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{request.agentNumber}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RequestTable({ searchQuery, statusFilter, dateRange }: RequestTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<AgentRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agent-requests", { page, limit }],
    queryFn: async () => {
      return await getCollectionStub<AgentRequest>("agentRequest", {
        page,
        limit,
        sortBy: "submittedAt",
        sortOrder: "desc",
      });
    },
    placeholderData: keepPreviousData,
  });

  const requests = (data?.data?.items ?? []) as AgentRequest[];
  
  // Apply client-side filtering
  const filteredRequests = requests.filter((request) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const userName = request.fullName || request.userName || '';
      const matchesSearch = 
        userName.toLowerCase().includes(searchLower) ||
        request.emailAddress?.toLowerCase().includes(searchLower) ||
        request._firebaseDocId.toLowerCase().includes(searchLower) ||
        request.agentCode?.toLowerCase().includes(searchLower) ||
        request.agentNumber?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter based on isApproved and processedAt
    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "pending") {
        if (request.isApproved !== false || request.processedAt) return false;
      } else if (statusFilter === "approved") {
        if (request.isApproved !== true) return false;
      } else if (statusFilter === "rejected") {
        if (request.isApproved !== false || !request.processedAt) return false;
      }
    }

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const requestDate = new Date(request.datetimeRequest || request.submittedAt || request.applicationDate || request.createdAt || '');
      const [startDate, endDate] = dateRange;
      if (requestDate < startDate || requestDate > endDate) {
        return false;
      }
    }

    return true;
  });

  // Sort by most recent
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.datetimeRequest || a.submittedAt || a.applicationDate || a.createdAt || 0).getTime();
    const dateB = new Date(b.datetimeRequest || b.submittedAt || b.applicationDate || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const errorMessage = error instanceof Error ? error.message : "Failed to fetch agent requests";

  const handleRowClick = (request: AgentRequest) => {
    setSelectedRequest(request);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content="Loading agent requests..." className="!text-[var(--text-secondary)]" />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-[var(--danger)] mb-2">Error loading agent requests</div>
        <div className="text-sm text-[var(--text-muted)] mb-4">{errorMessage}</div>
        <Button appearance="primary" onClick={() => refetch()} className="!bg-[var(--primary)] hover:!opacity-90">Retry</Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-x-auto rounded-t-xl">
          <Table
            data={sortedRequests}
            autoHeight
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table agent-table !bg-transparent min-w-[900px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as AgentRequest)}
          >
            <Column width={220} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => (
                  <span className="text-xs font-mono font-medium text-[var(--primary)]">{rowData._firebaseDocId.substring(0, 10)}...</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Applicant</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => {
                  const userName = rowData.fullName || rowData.userName || 'Unknown User';
                  const userAvatar = getAvatarUrl(userName);
                  return (
                    <div className="flex items-center gap-2.5">
                      <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-[var(--primary)]/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{userName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.emailAddress || 'No email'}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={1} width={180} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Agent Code</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => (
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{rowData.agentCode || 'N/A'}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{rowData.agentNumber || 'N/A'}</div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => <StatusBadge isApproved={rowData.isApproved} processedAt={rowData.processedAt} />}
              </Cell>
            </Column>

            <Column width={250} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Submitted Date</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => (
                  <span className="text-xs text-[var(--text-secondary)]">{formatDate(rowData.datetimeRequest || rowData.submittedAt || rowData.applicationDate || rowData.createdAt)}</span>
                )}
              </Cell>
            </Column>

            <Column width={60} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Action</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: AgentRequest) => (
                  <Dropdown
                    renderToggle={(props, ref) => (
                      <button {...props} ref={ref} className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]" onClick={(e) => e.stopPropagation()}>
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                    placement="bottomEnd"
                  >
                    <Dropdown.Item className="!text-xs !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]" onClick={() => handleRowClick(rowData)}>
                      <span className="flex items-center gap-2"><Icons.Eye className="w-3.5 h-3.5" />View</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="!text-xs !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]">
                      <span className="flex items-center gap-2"><Icons.Copy className="w-3.5 h-3.5" />Copy ID</span>
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--surface-soft)] rounded-b-xl">
          <div className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-medium text-[var(--text-secondary)]">{sortedRequests.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, sortedRequests.length)}</span> of <span className="font-medium text-[var(--text-secondary)]">{sortedRequests.length}</span> filtered results
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={sortedRequests.length}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            className="agent-pagination !text-xs"
          />
        </div>
      </motion.div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="sm" className="agent-drawer !w-[380px]" closeButton={false}>
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedRequest && (
              <motion.div
                key={selectedRequest._firebaseDocId}
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
                <RequestDetailPanel request={selectedRequest} onClose={() => setDrawerOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
