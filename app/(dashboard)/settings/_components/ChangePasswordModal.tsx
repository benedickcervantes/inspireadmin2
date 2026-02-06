"use client";

import { useState } from "react";
import { Modal, Button, Input, Form } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Lock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!currentPassword.trim()) {
      setError("Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);
    const success = await onSave(currentPassword, newPassword);
    setIsLoading(false);

    if (success) {
      handleClose();
    } else {
      setError("Current password is incorrect");
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError("");
    onClose();
  };

  const isPasswordValid = newPassword.length >= 6;
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      className="dark-modal"
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Lock className="w-5 h-5 text-[var(--accent)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Change Password
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Update your account password
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          {/* Current Password */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Current Password
            </Form.ControlLabel>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter current password"
                className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--accent)] !pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showCurrentPassword ? (
                  <Icons.EyeOff className="w-4 h-4" />
                ) : (
                  <Icons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Form.Group>

          {/* New Password */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              New Password
            </Form.ControlLabel>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Enter new password"
                className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--accent)] !pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showNewPassword ? (
                  <Icons.EyeOff className="w-4 h-4" />
                ) : (
                  <Icons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {newPassword && (
              <Form.HelpText className={`text-xs mt-1 ${isPasswordValid ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {isPasswordValid ? '✓ Password strength: Good' : '✗ Password must be at least 6 characters'}
              </Form.HelpText>
            )}
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Confirm New Password
            </Form.ControlLabel>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm new password"
                className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--accent)] !pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showConfirmPassword ? (
                  <Icons.EyeOff className="w-4 h-4" />
                ) : (
                  <Icons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <Form.HelpText className={`text-xs mt-1 ${doPasswordsMatch ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {doPasswordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </Form.HelpText>
            )}
          </Form.Group>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-[var(--danger-soft)] border border-[var(--danger)]/20 rounded-lg"
            >
              <Icons.AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0" />
              <span className="text-xs text-[var(--danger)]">{error}</span>
            </motion.div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="!bg-[var(--surface)] !border-t !border-[var(--border)] !pt-4 !pb-4">
        <div className="flex gap-3 justify-end mx-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleClose}
              appearance="subtle"
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSave}
              appearance="primary"
              loading={isLoading}
              disabled={!currentPassword || !newPassword || !confirmPassword || !isPasswordValid || !doPasswordsMatch}
              className="!bg-gradient-to-r !from-[var(--accent)] !to-purple-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Check className="w-4 h-4" />
                Change Password
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
