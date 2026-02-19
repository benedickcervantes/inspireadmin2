"use client";

import { useState } from 'react';
import { Modal, Button, Input, Message, useToaster } from 'rsuite';

// Icon components
type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  AlertTriangle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
};

interface PasswordConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  userName: string;
  title?: string;
  message?: string;
}

export default function PasswordConfirmationModal({
  open,
  onClose,
  onConfirm,
  userName,
  title = "Confirm Delete User",
  message = "This action cannot be undone. Please enter your password to confirm."
}: PasswordConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toaster = useToaster();

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setError('');
    setLoading(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify admin password with backend
      const { verifyAdminPassword } = await import('@/lib/api/adminOperations');
      const isValid = await verifyAdminPassword(password);

      if (isValid) {
        await onConfirm();
        toaster.push(
          <Message showIcon type="success">
            User deleted successfully
          </Message>,
          { placement: 'topEnd', duration: 3000 }
        );
        handleClose();
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Password verification error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleConfirm();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="xs"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title className="text-[var(--text-primary)] font-semibold">
          <span className="flex items-center gap-2">
            <Icons.AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
            {title}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-[var(--danger-soft)] border border-[var(--danger)] rounded-lg p-3">
            <p className="text-sm text-[var(--text-primary)] mb-2">
              You are about to delete user: <strong>{userName}</strong>
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {message}
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="!pr-10"
                disabled={loading}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <Icons.EyeOff className="w-4 h-4" />
                ) : (
                  <Icons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-xs text-[var(--danger)] mt-1.5 flex items-center gap-1">
                <Icons.AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleClose}
          appearance="subtle"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          appearance="primary"
          loading={loading}
          className="!bg-[var(--danger)] hover:!bg-[var(--danger-hover)]"
        >
          Delete User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
