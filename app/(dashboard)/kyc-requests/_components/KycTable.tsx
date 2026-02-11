"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Drawer, Dropdown, Loader, Modal, Pagination, Table } from "rsuite";
import { getFirebaseCollection } from "@/lib/api/firebaseCollections";

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
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  AlertTriangle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
};

type KycStatus = "pending" | "in_review" | "approved" | "rejected";
type KycLevel = "basic" | "advanced" | "enhanced";
type KycRisk = "low" | "medium" | "high";
type DocumentStatus = "submitted" | "needs_review" | "rejected";

interface KycDocument {
  name: string;
  status: DocumentStatus;
  url?: string;
}

interface KycRequest {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  level: KycLevel;
  status: KycStatus;
  risk: KycRisk;
  riskScore: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  notes?: string;
  documents: KycDocument[];
}

interface FirebaseKycRequest {
  _firebaseDocId: string;
  status?: string;
  submittedAt?: string | number | { _seconds: number };
  reviewedAt?: string | number | { _seconds: number };
  reviewedBy?: string;
  userId?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
  };
  personalInfo?: {
    firstName?: string;
    lastName?: string;
  };
  documents?: Record<string, unknown>;
  [key: string]: unknown;
}

const formatDateTime = (value?: string | number | { _seconds: number }) => {
  if (!value) return "N/A";
  if (typeof value === "number") {
    const date = new Date(value < 1e12 ? value * 1000 : value);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleString();
  }
  if (typeof value === "object" && "_seconds" in value) {
    const date = new Date(value._seconds * 1000);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  }
  return "N/A";
};

const buildUserName = (record: FirebaseKycRequest) => {
  const userFirst = record.user?.firstName || record.personalInfo?.firstName || "";
  const userLast = record.user?.lastName || record.personalInfo?.lastName || "";
  return `${userFirst} ${userLast}`.trim() || "Unknown User";
};

const buildUserEmail = (record: FirebaseKycRequest) => {
  return record.user?.emailAddress || "No email";
};

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;

const deriveRisk = (status?: string): { risk: KycRisk; score: number } => {
  const statusLower = (status || "pending").toLowerCase();
  if (statusLower === "approved") return { risk: "low", score: 15 };
  if (statusLower === "rejected") return { risk: "high", score: 85 };
  if (statusLower === "in_review") return { risk: "medium", score: 60 };
  return { risk: "medium", score: 50 };
};

const buildDocuments = (record: FirebaseKycRequest): KycDocument[] => {
  const statusLower = (record.status || "pending").toLowerCase();
  const status: DocumentStatus =
    statusLower === "rejected" ? "rejected" : "submitted";

  const documents = record.documents || {};
  const items = [
    { key: "idFrontPhoto", name: "ID Front" },
    { key: "idBackPhoto", name: "ID Back" },
    { key: "selfiePhoto", name: "Selfie Check" },
  ];

  return items.map((item) => ({
    name: item.name,
    status:
      statusLower === "rejected"
        ? "rejected"
        : documents[item.key]
          ? status
          : "needs_review",
    url: documents[item.key] as string | undefined,
  }));
};

const normalizeKycRequest = (record: FirebaseKycRequest): KycRequest => {
  const name = buildUserName(record);
  const { risk, score } = deriveRisk(record.status);
  const statusLower = (record.status || "pending").toLowerCase();
  const normalizedStatus: KycStatus =
    statusLower === "approved" ||
    statusLower === "rejected" ||
    statusLower === "in_review"
      ? statusLower
      : "pending";
  return {
    id: record._firebaseDocId,
    user: {
      name,
      email: buildUserEmail(record),
      avatar: getAvatarUrl(name),
    },
    level: "basic",
    status: normalizedStatus,
    risk,
    riskScore: score,
    submittedAt: formatDateTime(record.submittedAt),
    reviewedAt: record.reviewedAt ? formatDateTime(record.reviewedAt) : undefined,
    reviewer: record.reviewedBy,
    documents: buildDocuments(record),
  };
};

const StatusBadge = ({ status }: { status: KycStatus }) => {
  const config = {
    pending: {
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/30",
      dot: "bg-[var(--warning)]",
      label: "Pending",
    },
    in_review: {
      bg: "bg-[var(--primary-soft)]",
      text: "text-[var(--primary)]",
      border: "border-[var(--primary)]/30",
      dot: "bg-[var(--primary)]",
      label: "In Review",
    },
    approved: {
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
      border: "border-[var(--success)]/30",
      dot: "bg-[var(--success)]",
      label: "Approved",
    },
    rejected: {
      bg: "bg-[var(--danger-soft)]",
      text: "text-[var(--danger)]",
      border: "border-[var(--danger)]/30",
      dot: "bg-[var(--danger)]",
      label: "Rejected",
    },
  };

  const { bg, text, border, dot, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const RiskBadge = ({ risk }: { risk: KycRisk }) => {
  const config = {
    low: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", label: "Low" },
    medium: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]", border: "border-[var(--warning)]/30", label: "Medium" },
    high: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", label: "High" },
  };

  const { bg, text, border, label } = config[risk];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium`}>
      {label}
    </span>
  );
};

const LevelBadge = ({ level }: { level: KycLevel }) => {
  const config = {
    basic: { bg: "bg-[var(--surface-soft)]", text: "text-[var(--text-secondary)]", label: "Basic" },
    advanced: { bg: "bg-[var(--primary-soft)]", text: "text-[var(--primary)]", label: "Advanced" },
    enhanced: { bg: "bg-[var(--accent-soft)]", text: "text-[var(--accent)]", label: "Enhanced" },
  };

  const { bg, text, label } = config[level];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${bg} ${text} text-[11px] font-medium`}>
      {label}
    </span>
  );
};

const DocumentBadge = ({ status }: { status: DocumentStatus }) => {
  const config = {
    submitted: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", label: "Submitted" },
    needs_review: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]", label: "Needs Review" },
    rejected: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", label: "Rejected" },
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${bg} ${text} text-[10px] font-medium`}>
      {label}
    </span>
  );
};

const KycDetailPanel = ({
  kyc,
  onClose,
  onApprove,
  onReject,
  onPreview,
}: {
  kyc: KycRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onPreview: (url: string, title: string) => void;
}) => {
  const riskBar = {
    low: "bg-[var(--success)]",
    medium: "bg-[var(--warning)]",
    high: "bg-[var(--danger)]",
  }[kyc.risk];

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">KYC Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{kyc.id}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2.5 mb-3">
          <img src={kyc.user.avatar} alt={kyc.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary)]/30" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{kyc.user.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{kyc.user.email}</div>
          </div>
        </div>

        <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Risk Score</div>
              <div className="text-base font-semibold text-[var(--text-primary)]">{kyc.riskScore}</div>
            </div>
            <RiskBadge risk={kyc.risk} />
          </div>
          <div className="mt-1.5 h-1 bg-[var(--surface)] rounded-full overflow-hidden">
            <div className={`h-full ${riskBar}`} style={{ width: `${kyc.riskScore}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Level</div>
            <div className="mt-1">
              <LevelBadge level={kyc.level} />
            </div>
          </div>
          <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Status</div>
            <div className="mt-1">
              <StatusBadge status={kyc.status} />
            </div>
          </div>
          <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Reviewer</div>
            <div className="mt-1 text-[13px] font-medium text-[var(--text-primary)]">{kyc.reviewer || "Unassigned"}</div>
          </div>
          <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Submitted</div>
            <div className="mt-1 text-[13px] font-medium text-[var(--text-primary)]">{kyc.submittedAt}</div>
          </div>
        </div>

        {kyc.reviewedAt && (
          <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5 mb-3">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Reviewed At</div>
            <div className="mt-1 text-[13px] font-medium text-[var(--text-primary)]">{kyc.reviewedAt}</div>
          </div>
        )}

        <div className="bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] p-2.5 mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">Documents</div>
          </div>
          <div className="space-y-1.5">
            {kyc.documents.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between rounded-md bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="text-[11px] text-[var(--text-secondary)]">{doc.name}</div>
                  <DocumentBadge status={doc.status} />
                </div>
                {doc.url && (
                  <button
                    onClick={() => onPreview(doc.url!, doc.name)}
                    className="ml-2 w-6 h-6 rounded hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors flex-shrink-0"
                    title="Preview image"
                  >
                    <Icons.Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {kyc.notes && (
          <div className="bg-[var(--warning-soft)] rounded-md border border-[var(--warning)]/20 p-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Icons.AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)]" />
              <div className="text-[11px] font-semibold text-[var(--warning)] uppercase tracking-wide">Notes</div>
            </div>
            <div className="text-[13px] text-[var(--text-primary)]">{kyc.notes}</div>
          </div>
        )}
      </div>

      {(kyc.status === "pending" || kyc.status === "in_review") && (
        <div className="p-3 border-t border-[var(--border)] flex gap-2">
          <Button
            size="sm"
            appearance="default"
            block
            className="!rounded-md !border-[var(--danger)]/30 !bg-[var(--danger-soft)] !text-[var(--danger)] hover:!bg-[var(--danger)]/20"
            onClick={onReject}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Icons.X className="w-3.5 h-3.5" />
              Reject
            </span>
          </Button>
          <Button
            size="sm"
            appearance="primary"
            block
            className="!rounded-md !bg-gradient-to-r !from-[var(--success)] !to-emerald-500 hover:!opacity-90"
            onClick={onApprove}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Icons.Check className="w-3.5 h-3.5" />
              Approve
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

interface KycTableProps {
  searchQuery: string;
  statusFilter: string;
  dateRange: [Date, Date] | null;
}

export default function KycTable({ searchQuery, statusFilter, dateRange }: KycTableProps) {
  const [selectedKyc, setSelectedKyc] = useState<KycRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Format date range for API
  const startDate = dateRange?.[0] ? dateRange[0].toISOString() : undefined;
  const endDate = dateRange?.[1] ? dateRange[1].toISOString() : undefined;

  // Fetch data with server-side filtering for status and search (backend supports these)
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "kyc-requests",
      {
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      },
    ],
    queryFn: () =>
      getFirebaseCollection<FirebaseKycRequest>("kycRequest", {
        page,
        limit,
        sortBy: "submittedAt",
        sortOrder: "desc",
        includeUser: true,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  // Apply client-side filters for date range (until backend supports it)
  const kycRequests = useMemo(() => {
    let requests = (data?.data?.items ?? []).map(normalizeKycRequest);

    // Apply date range filter (client-side)
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = new Date(dateRange[0]);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange[1]);
      end.setHours(23, 59, 59, 999);

      requests = requests.filter((request) => {
        const submittedDate = new Date(request.submittedAt);
        return submittedDate >= start && submittedDate <= end;
      });
    }

    return requests;
  }, [data, dateRange]);
  const total = data?.data?.pagination.total ?? 0;
  const errorMessage =
    error instanceof Error ? error.message : "Failed to fetch KYC requests";

  const handleRowClick = (kyc: KycRequest) => {
    setSelectedKyc(kyc);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedKyc(null);
  };

  const handleApprove = () => {
    console.log("Approve KYC:", selectedKyc?.id);
    handleCloseDrawer();
  };

  const handleReject = () => {
    console.log("Reject KYC:", selectedKyc?.id);
    handleCloseDrawer();
  };

  const handlePreviewImage = (url: string, title: string) => {
    setImagePreview({ url, title });
  };

  const handleClosePreview = () => {
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader
          size="md"
          content="Loading KYC requests..."
          className="!text-[var(--text-secondary)]"
        />
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
        <div className="text-[var(--danger)] mb-2">
          Error loading KYC requests
        </div>
        <div className="text-sm text-[var(--text-muted)] mb-4">
          {errorMessage}
        </div>
        <Button
          appearance="primary"
          onClick={() => refetch()}
          className="!bg-[var(--primary)] hover:!opacity-90"
        >
          Retry
        </Button>
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
            data={kycRequests}
            autoHeight
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table kyc-table !bg-transparent min-w-[980px] cursor-pointer"
            rowKey="id"
            onRowClick={(rowData) => handleRowClick(rowData as KycRequest)}
          >
            <Column width={110} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <span className="text-xs font-mono font-medium text-[var(--primary)]">{rowData.id}</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={2} minWidth={220} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <div className="flex items-center gap-2.5">
                    <img src={rowData.user.avatar} alt={rowData.user.name} className="w-8 h-8 rounded-full object-cover border border-[var(--primary)]/30 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{rowData.user.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.user.email}</div>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Level</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <LevelBadge level={rowData.level} />
                )}
              </Cell>
            </Column>

            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Risk</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={rowData.risk} />
                    <span className="text-[11px] text-[var(--text-muted)]">{rowData.riskScore}</span>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={130} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <StatusBadge status={rowData.status} />
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={150} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Submitted</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <span className="text-xs text-[var(--text-secondary)]">{rowData.submittedAt}</span>
                )}
              </Cell>
            </Column>

            <Column width={130} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Reviewer</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <span className="text-xs text-[var(--text-secondary)]">{rowData.reviewer || "Unassigned"}</span>
                )}
              </Cell>
            </Column>

            <Column width={70} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Actions</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: KycRequest) => (
                  <button
                    className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(rowData);
                    }}
                  >
                    <Icons.MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--surface-soft)] rounded-b-xl">
          <div className="text-xs text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--text-secondary)]">
              {kycRequests.length > 0 ? (page - 1) * limit + 1 : 0}-
              {Math.min(page * limit, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-secondary)]">
              {total}
            </span>{" "}
            requests
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            className="!m-0"
          />
        </div>
      </motion.div>

      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="sm"
        className="kyc-drawer !w-[380px]"
      >
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedKyc && (
              <motion.div
                key={selectedKyc.id}
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
                <KycDetailPanel
                  kyc={selectedKyc}
                  onClose={handleCloseDrawer}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onPreview={handlePreviewImage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>

      <Modal
        open={!!imagePreview}
        onClose={handleClosePreview}
        size="md"
        className="kyc-image-preview"
      >
        <Modal.Header>
          <Modal.Title className="text-[var(--text-primary)]">
            {imagePreview?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="!p-0">
          {imagePreview && (
            <div className="relative w-full bg-[var(--surface-soft)] flex items-center justify-center p-4">
              <img
                src={imagePreview.url}
                alt={imagePreview.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClosePreview} appearance="subtle">
            Close
          </Button>
          {imagePreview && (
            <Button
              appearance="primary"
              onClick={() => window.open(imagePreview.url, '_blank')}
              className="!bg-[var(--primary)]"
            >
              Open in New Tab
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
