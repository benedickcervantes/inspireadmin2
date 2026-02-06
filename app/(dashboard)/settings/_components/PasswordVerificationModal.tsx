"use client";

import { useState } from "react";
import { Modal, Button, Input, Form } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

interface PasswordVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (password: string) => Promise<boolean>;
  title?: string;
  description?: string;
}

export default function PasswordVerificationModal({
  open,
  onClose,
  onVerify,
  title = "Password Required",
  description = "Please enter your password to continue",
}: PasswordVerificationModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    const isValid = await onVerify(password);
    setIsLoading(false);

    if (isValid) {
      handleClose();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    setError("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password.trim()) {
      handleVerify();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="xs"
      className="dark-modal"
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[var(--warning)]/20 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Shield className="w-5 h-5 text-[var(--warning)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {description}
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Password
            </Form.ControlLabel>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--warning)] !pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? (
                  <Icons.EyeOff className="w-4 h-4" />
                ) : (
                  <Icons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
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
              onClick={handleVerify}
              appearance="primary"
              loading={isLoading}
              disabled={!password.trim()}
              className="!bg-gradient-to-r !from-[var(--warning)] !to-amber-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Check className="w-4 h-4" />
                Verify Password
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
