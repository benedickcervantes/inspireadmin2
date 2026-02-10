"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Table, Button, Drawer, Dropdown, Loader } from "rsuite";

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
  Bitcoin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  ),
  Coins: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="M16.71 13.88A.5.5 0 0 0 16.5 13.5h-2a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2z" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
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
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Image: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-3.5-3.5L9 20" />
    </svg>
  ),
};

interface CryptoDeposit {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  contact: string;
  amount: number;
  cryptoType: string;
  date: string;
  time: string;
  receiptStatus: "uploaded" | "pending" | "view_receipt";
  approvalStatus: "approved" | "pending" | "rejected";
}

// Mock data matching the image
const mockDeposits: CryptoDeposit[] = [
  {
    id: "1",
    user: {
      name: "Kate Villaas",
      email: "villaas@inspire.com",
    },
    contact: "ID: cryptoDeposit_176446560187_JavusProp",
    amount: 43224.31,
    cryptoType: "BTC",
    date: "Dec 23, 2025",
    time: "16:23:31",
    receiptStatus: "uploaded",
    approvalStatus: "approved",
  },
  {
    id: "2",
    user: {
      name: "Brian Perez",
      email: "perezbriandev@gmail.com",
    },
    contact: "ID: cryptoDeposit_176337773190_vethusSqPy",
    amount: 198.62,
    cryptoType: "ETH",
    date: "Jul 24, 2025",
    time: "11:28:51",
    receiptStatus: "uploaded",
    approvalStatus: "pending",
  },
];

// Helper functions
const formatDate = (dateString: string): string => {
  return dateString;
};

const getAvatarUrl = (user: CryptoDeposit['user']): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=ffffff&size=150`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    pending: {
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/30",
      dot: "bg-[var(--warning)]",
      label: "Pending",
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

  const statusLower = (status || 'pending').toLowerCase();
  const { bg, text, border, dot, label } = config[statusLower] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const ReceiptStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string; icon: React.FC<IconProps>; label: string }> = {
    uploaded: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
      icon: Icons.Image,
      label: "Uploaded",
    },
    pending: {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/20",
      icon: Icons.Clock,
      label: "Pending",
    },
    view_receipt: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
      icon: Icons.Eye,
      label: "View Receipt",
    },
  };

  const statusLower = (status || 'pending').toLowerCase();
  const { bg, text, border, icon: Icon, label } = config[statusLower] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${bg} ${text} ${border} text-[11px] font-medium`}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

const CryptoTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { bg: string; text: string; icon: React.FC<IconProps> }> = {
    BTC: {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      icon: Icons.Bitcoin,
    },
    ETH: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      icon: Icons.Coins,
    },
  };

  const { bg, text, icon: Icon } = config[type] || config.BTC;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} ${text} text-[11px] font-medium`}>
      <Icon className="w-3 h-3" />
      {type}
    </div>
  );
};

// Detail Panel Component
const CryptoDepositDetailPanel = ({
  deposit,
  onClose,
  onApprove,
  onReject,
}: {
  deposit: CryptoDeposit;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const userAvatar = getAvatarUrl(deposit.user);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] font-[var(--font-google-sans)]">Crypto Deposit Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{deposit.id}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={deposit.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{deposit.user.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{deposit.user.email}</div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 mb-3 text-white">
          <div className="text-[11px] text-white/70 uppercase tracking-wide mb-1">Deposit Amount</div>
          <div className="text-xl font-bold font-[var(--font-google-sans)]">₱{deposit.amount.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <CryptoTypeBadge type={deposit.cryptoType} />
            <StatusBadge status={deposit.approvalStatus} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Contact ID</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{deposit.contact}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Date & Time</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{deposit.date} {deposit.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Image className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Receipt Status</div>
              <div className="mt-0.5">
                <ReceiptStatusBadge status={deposit.receiptStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {deposit.approvalStatus === "pending" && (
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

export default function CryptoDepositsTable() {
  const [selectedDeposit, setSelectedDeposit] = useState<CryptoDeposit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading] = useState(false);

  const handleRowClick = (deposit: CryptoDeposit) => {
    setSelectedDeposit(deposit);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDeposit(null);
  };

  const handleApprove = () => {
    console.log("Approve crypto deposit:", selectedDeposit?.id);
    handleCloseDrawer();
  };

  const handleReject = () => {
    console.log("Reject crypto deposit:", selectedDeposit?.id);
    handleCloseDrawer();
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content="Loading crypto deposits..." className="!text-[var(--text-secondary)]" />
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
            data={mockDeposits}
            autoHeight
            rowHeight={70}
            headerHeight={40}
            hover
            className="app-table crypto-deposits-table !bg-transparent min-w-[850px] lg:min-w-[1050px] cursor-pointer"
            rowKey="id"
            onRowClick={(rowData) => handleRowClick(rowData as CryptoDeposit)}
          >
            <Column flexGrow={1} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Request Details</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => {
                  const userAvatar = getAvatarUrl(rowData.user);
                  return (
                    <div className="flex items-center gap-3">
                      <img src={userAvatar} alt={rowData.user.name} className="w-10 h-10 rounded-full object-cover border border-orange-500/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">{rowData.user.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate font-mono">{rowData.contact}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={150} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Contact Info</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <div className="flex items-center gap-2">
                    <Icons.Mail className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[12px] text-[var(--text-secondary)] truncate">{rowData.user.email}</span>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={160} align="right">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Amount & Crypto Type</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--text-primary)] font-[var(--font-google-sans)]">₱{rowData.amount.toLocaleString()}</div>
                    <div className="mt-1">
                      <CryptoTypeBadge type={rowData.cryptoType} />
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={130} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Date & Time</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <div>
                    <div className="text-xs font-medium text-[var(--text-secondary)]">{rowData.date}</div>
                    <div className="text-xs text-[var(--text-muted)]">{rowData.time}</div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={150} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Receipt Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <ReceiptStatusBadge status={rowData.receiptStatus} />
                )}
              </Cell>
            </Column>

            <Column width={110} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <StatusBadge status={rowData.approvalStatus} />
                )}
              </Cell>
            </Column>

            <Column width={100} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Actions</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: CryptoDeposit) => (
                  <div className="flex items-center gap-1">
                    {rowData.approvalStatus === "pending" && (
                      <>
                        <Button
                          size="xs"
                          appearance="primary"
                          className="!bg-[var(--success)] !border-[var(--success)] hover:!opacity-90 !px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Approve", rowData.id);
                          }}
                        >
                          <Icons.Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="xs"
                          appearance="default"
                          className="!bg-[var(--danger-soft)] !border-[var(--danger)]/30 !text-[var(--danger)] hover:!bg-[var(--danger)]/20 !px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Reject", rowData.id);
                          }}
                        >
                          <Icons.X className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {rowData.approvalStatus === "approved" && (
                      <span className="text-xs text-[var(--success)] font-medium">Approved</span>
                    )}
                  </div>
                )}
              </Cell>
            </Column>
          </Table>
        </div>
      </motion.div>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="sm"
        className="crypto-deposit-drawer !w-[380px]"
      >
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedDeposit && (
              <motion.div
                key={selectedDeposit.id}
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
                <CryptoDepositDetailPanel
                  deposit={selectedDeposit}
                  onClose={handleCloseDrawer}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}