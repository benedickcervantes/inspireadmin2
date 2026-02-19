"use client";

import React, { useState } from "react";
import { Modal, Button, Input, Divider, Loader } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
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
};

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
}

interface BulkDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  users: User[];
}

export default function BulkDeleteModal({ open, onClose, onConfirm, users }: BulkDeleteModalProps) {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await onConfirm(password);
      setPassword("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete users");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setPassword("");
      setError("");
      onClose();
    }
  };

  const getFullName = (user: User) => {
    const first = user.firstName || '';
    const last = user.lastName || '';
    return `${first} ${last}`.trim() || 'Unknown User';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      className="dark-modal [&_.rs-modal-content]:!bg-[var(--surface)] [&_.rs-modal-content]:!border-[var(--border)]"
    >
      <Modal.Header className="!border-b !border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--danger-soft)] flex items-center justify-center">
            <Icons.AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
          </div>
          <div>
            <Modal.Title className="!text-[var(--text-primary)] !text-base !font-semibold">
              Delete {users.length} User{users.length !== 1 ? 's' : ''}
            </Modal.Title>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              This action cannot be undone
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="!bg-[var(--surface-soft)]">
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="rounded-lg border border-[var(--danger)] bg-[var(--danger-soft)] p-3">
            <p className="text-sm text-[var(--danger)] font-medium">
              You are about to permanently delete {users.length} user account{users.length !== 1 ? 's' : ''}. 
              This will remove all associated data and cannot be recovered.
            </p>
          </div>

          {/* User List */}
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Selected Accounts
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-subtle)]"
                >
                  <Icons.User className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {getFullName(user)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {user.emailAddress || 'No email'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider className="!my-3 !bg-[var(--border-subtle)]" />

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Admin Password
            </label>
            <Input
              type="password"
              placeholder="Enter your admin password to confirm"
              value={password}
              onChange={setPassword}
              disabled={isDeleting}
              className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
              autoComplete="off"
            />
            {error && (
              <div className="mt-2 text-xs text-[var(--danger)]">
                {error}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="!border-t !border-[var(--border-subtle)] !bg-[var(--surface)]">
        <Button
          onClick={handleClose}
          appearance="subtle"
          disabled={isDeleting}
          className="!text-[var(--text-secondary)]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          appearance="primary"
          disabled={isDeleting || !password.trim()}
          className="!bg-gradient-to-r !from-[var(--danger)] !to-[var(--danger-strong)]"
        >
          {isDeleting ? (
            <span className="flex items-center gap-2">
              <Loader size="xs" />
              Deleting...
            </span>
          ) : (
            `Delete ${users.length} Account${users.length !== 1 ? 's' : ''}`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
