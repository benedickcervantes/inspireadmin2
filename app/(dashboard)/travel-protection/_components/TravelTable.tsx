"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination, Modal } from "rsuite";
import { getCollectionStub } from "@/lib/api/collectionStubs";
import { getUserById } from "@/lib/api/users";

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
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface TravelApplication {
  _firebaseDocId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  destination?: string;
  destinationAddress?: string;
  travelDate?: string;
  departureTime?: string | number | { _seconds: number };
  arrivalTime?: string | number | { _seconds: number };
  status?: string;
  coverage?: string;
  premium?: number;
  fee?: number;
  protectionFee?: number;
  amount?: number;
  createdAt?: string | number | { _seconds: number };
  submittedAt?: string | number | { _seconds: number };
  policyType?: string;
  startDate?: string;
  endDate?: string;
  homeAddress?: string;
  citizenship?: string;
  passportPhotoUrl?: string;
  passportNumber?: string;
  governmentIdUrl?: string;
  stayDuration?: number;
  airline?: string;
  purposeOfTravel?: string;
  purpose?: string;
  sourceOfFund?: string;
  user?: {
    odId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    email?: string;
    accountNumber?: string;
  };
  // Fallback fields if user is not nested
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  email?: string;
  accountNumber?: string;
  [key: string]: unknown;
}

// Helper functions
const formatDate = (value?: string | number | { _seconds: number }): string => {
  if (!value) return 'N/A';
  
  try {
    let date: Date;
    
    if (typeof value === 'number') {
      // Handle both seconds and milliseconds timestamps
      date = new Date(value < 1e12 ? value * 1000 : value);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'object' && '_seconds' in value) {
      date = new Date(value._seconds * 1000);
    } else {
      return 'N/A';
    }
    
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

const formatDateTime = (value?: string | number | { _seconds: number }): string => {
  if (!value) return 'N/A';
  
  try {
    let date: Date;
    
    if (typeof value === 'number') {
      // Handle both seconds and milliseconds timestamps
      date = new Date(value < 1e12 ? value * 1000 : value);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'object' && '_seconds' in value) {
      date = new Date(value._seconds * 1000);
    } else {
      return 'N/A';
    }
    
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'N/A';
  }
};

const getFullName = (application: TravelApplication): string => {
  // Check for userName field first
  if (application.userName) return application.userName;
  
  // Try nested user object
  if (application.user) {
    const first = application.user.firstName || '';
    const last = application.user.lastName || '';
    const name = `${first} ${last}`.trim();
    if (name) return name;
  }
  
  // Fallback to root level fields
  const first = application.firstName || '';
  const last = application.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

const getEmail = (application: TravelApplication): string => {
  return application.emailAddress || 
         application.userEmail || 
         application.user?.emailAddress || 
         application.user?.email || 
         application.email || 
         'No email';
};

const getAccountNumber = (application: TravelApplication): string => {
  return application.user?.accountNumber || 
         application.accountNumber || 
         'N/A';
};

const getFee = (application: TravelApplication): number | undefined => {
  return application.protectionFee || application.fee || application.premium || application.amount;
};

const getDestination = (application: TravelApplication): string => {
  return application.destinationAddress || application.destination || 'N/A';
};

const getAvatarUrl = (application: TravelApplication): string => {
  const name = getFullName(application);
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
  const userName = getFullName(application);
  const userAvatar = getAvatarUrl(application);
  const userEmail = getEmail(application);
  const accountNumber = getAccountNumber(application);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (application.userId) {
        setLoadingBalance(true);
        try {
          const response = await getUserById(application.userId);
          if (response.success && response.data) {
            setUserBalance(response.data.availBalanceAmount ?? null);
          }
        } catch (error) {
          console.error('Error fetching user balance:', error);
        } finally {
          setLoadingBalance(false);
        }
      }
    };

    fetchUserBalance();
  }, [application.userId]);

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
            <div className="text-[11px] text-[var(--text-muted)]">{userEmail}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <CoverageBadge coverage={application.coverage} />
            <StatusBadge status={application.status || 'pending'} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <div className="text-xl font-bold">{getFee(application) ? `₱${getFee(application)!.toLocaleString()}` : 'N/A'}</div>
              <div className="text-[11px] text-purple-100 mt-1">Protection Fee</div>
            </div>
            <div>
              <div className="text-xl font-bold">
                {loadingBalance ? (
                  <span className="text-sm">Loading...</span>
                ) : userBalance !== null ? (
                  `₱${userBalance.toLocaleString()}`
                ) : (
                  'N/A'
                )}
              </div>
              <div className="text-[11px] text-purple-100 mt-1">Available Balance</div>
            </div>
          </div>
        </div>

        {/* Approve/Reject Actions - Only show for pending applications */}
        {((application.status || 'pending').toLowerCase() === 'pending') && (
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                // TODO: Add approve functionality
                console.log('Approve:', application._firebaseDocId);
              }}
              className="group flex-1 relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--success-soft)] to-[var(--success-soft)] text-[var(--success)] hover:from-[var(--success)] hover:to-[var(--success)] hover:text-white text-sm font-semibold transition-all duration-300 border border-[var(--success)]/30 hover:border-[var(--success)] hover:shadow-lg hover:shadow-[var(--success)]/30 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <Icons.Check className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span className="tracking-wide">Approve Application</span>
              </span>
            </button>
            <button
              onClick={() => {
                // TODO: Add reject functionality
                console.log('Reject:', application._firebaseDocId);
              }}
              className="group flex-1 relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--danger-soft)] to-[var(--danger-soft)] text-[var(--danger)] hover:from-[var(--danger)] hover:to-[var(--danger)] hover:text-white text-sm font-semibold transition-all duration-300 border border-[var(--danger)]/30 hover:border-[var(--danger)] hover:shadow-lg hover:shadow-[var(--danger)]/30 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <Icons.X className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span className="tracking-wide">Reject Application</span>
              </span>
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="border border-[var(--border-subtle)] rounded-lg p-3 bg-[var(--surface-soft)]">
            <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-3 px-1">Travel Details</div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--accent-soft)] rounded-md border border-[var(--accent)]/20">
                <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--accent)]/30 flex items-center justify-center">
                  <Icons.MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--accent)] uppercase tracking-wide">Destination</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{getDestination(application)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Departure Time</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDateTime(application.departureTime || application.travelDate || application.startDate)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Arrival Time</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDateTime(application.arrivalTime || application.endDate)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Passport Number</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.passportNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Stay Duration</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">
                    {application.stayDuration ? `${application.stayDuration} days` : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Airline</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.airline || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                  <Icons.MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Purpose of Travel</div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.purposeOfTravel || application.purpose || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[var(--border-subtle)] rounded-lg p-3 bg-[var(--surface-soft)]">
            <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-3 px-1">Travel Documents</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                    <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Passport Photo</div>
                    <div className="text-[13px] font-medium text-[var(--text-primary)]">
                      {application.passportPhotoUrl ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                </div>
                {application.passportPhotoUrl && (
                  <button
                    onClick={() => setPreviewImage({ url: application.passportPhotoUrl!, title: 'Passport Photo' })}
                    className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]"
                  >
                    <Icons.Eye className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[var(--surface)] rounded-md border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center">
                    <Icons.Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Government ID</div>
                    <div className="text-[13px] font-medium text-[var(--text-primary)]">
                      {application.governmentIdUrl ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                </div>
                {application.governmentIdUrl && (
                  <button
                    onClick={() => setPreviewImage({ url: application.governmentIdUrl!, title: 'Government ID' })}
                    className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]"
                  >
                    <Icons.Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} size="lg" className="dark-modal">
        <Modal.Header>
          <Modal.Title>{previewImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="!p-0">
          {previewImage && (
            <div className="flex items-center justify-center bg-[var(--surface-soft)] p-4">
              <img 
                src={previewImage.url} 
                alt={previewImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            appearance="primary" 
            className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)]"
            onClick={() => previewImage && window.open(previewImage.url, '_blank')}
          >
            <div className="flex items-center gap-2">
              <Icons.Eye className="w-4 h-4" />
              Open in New Tab
            </div>
          </Button>
          <Button onClick={() => setPreviewImage(null)} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default function TravelTable({
  searchQuery = "",
  statusFilter = "all",
  dateRange = null,
}: {
  searchQuery?: string;
  statusFilter?: string;
  dateRange?: [Date, Date] | null;
}) {
  const [selectedApplication, setSelectedApplication] = useState<TravelApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["travel-applications", { page, limit }],
    queryFn: () =>
      getCollectionStub<TravelApplication>("travelApplications", {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
        includeUser: true,
      }),
    placeholderData: keepPreviousData,
  });

  const applications = (data?.data?.items ?? []) as TravelApplication[];
  const total = data?.data?.pagination.total ?? 0;
  const errorMessage = error instanceof Error ? error.message : "Failed to fetch travel applications";

  console.log("Travel applications data:", { applications, total, data });

  // Filter applications based on search query, status, and date range
  const filteredApplications = applications.filter((app) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userName = getFullName(app).toLowerCase();
      const userEmail = getEmail(app).toLowerCase();
      const destination = getDestination(app).toLowerCase();
      const appId = app._firebaseDocId.toLowerCase();
      
      if (
        !userName.includes(query) &&
        !userEmail.includes(query) &&
        !destination.includes(query) &&
        !appId.includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      const appStatus = (app.status || "pending").toLowerCase();
      if (appStatus !== statusFilter.toLowerCase()) {
        return false;
      }
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const appDate = app.submittedAt || app.createdAt;
      if (appDate) {
        let date: Date;
        if (typeof appDate === 'number') {
          date = new Date(appDate < 1e12 ? appDate * 1000 : appDate);
        } else if (typeof appDate === 'string') {
          date = new Date(appDate);
        } else if (typeof appDate === 'object' && '_seconds' in appDate) {
          date = new Date(appDate._seconds * 1000);
        } else {
          return true; // If we can't parse the date, include it
        }
        
        if (date < dateRange[0] || date > dateRange[1]) {
          return false;
        }
      }
    }

    return true;
  }).sort((a, b) => {
    // Sort by most recent date (newest first)
    const getTimestamp = (app: TravelApplication): number => {
      const date = app.submittedAt || app.createdAt;
      if (!date) return 0;
      
      if (typeof date === 'number') {
        return date < 1e12 ? date * 1000 : date;
      } else if (typeof date === 'string') {
        return new Date(date).getTime();
      } else if (typeof date === 'object' && '_seconds' in date) {
        return date._seconds * 1000;
      }
      return 0;
    };
    
    return getTimestamp(b) - getTimestamp(a); // Descending order (newest first)
  });

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

  if (!isLoading && filteredApplications.length === 0) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-[var(--text-muted)] mb-2">No travel applications found</div>
        <div className="text-sm text-[var(--text-muted)]">
          {searchQuery || statusFilter !== "all" || dateRange
            ? "Try adjusting your filters to see more results."
            : "There are no travel protection applications in the database yet."}
        </div>
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
            data={filteredApplications}
            height={600}
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[1000px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as TravelApplication)}
          >
            <Column flexGrow={1} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Applicant</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => {
                  const userName = getFullName(rowData);
                  const userAvatar = getAvatarUrl(rowData);
                  const userEmail = getEmail(rowData);
                  return (
                    <div className="flex items-center gap-2.5">
                      <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-[var(--border)]" />
                      <div>
                        <div className="text-[13px] font-medium text-[var(--text-primary)]">{userName}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{userEmail}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={120} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Destination</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{getDestination(rowData)}</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={120} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Fee</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => {
                  const fee = getFee(rowData);
                  return (
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {fee ? `₱${fee.toLocaleString()}` : 'N/A'}
                    </span>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={120} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => <StatusBadge status={rowData.status || 'pending'} />}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={130} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Submitted</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(rowData.submittedAt || rowData.createdAt)}
                  </span>
                )}
              </Cell>
            </Column>

            <Column width={70} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Actions</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TravelApplication) => (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(rowData);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110 active:scale-95 mx-auto"
                  >
                    <Icons.MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-medium text-[var(--text-primary)]">{filteredApplications.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, filteredApplications.length)}</span> of <span className="font-medium text-[var(--text-primary)]">{filteredApplications.length}</span>
            {(searchQuery || statusFilter !== "all" || dateRange) && (
              <span className="text-[var(--text-muted)]"> (filtered from {total} total)</span>
            )}
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={filteredApplications.length}
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
