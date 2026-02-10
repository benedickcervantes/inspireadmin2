"use client";

import { useState } from "react";
import { Modal, Button, Input, Form, Message, toaster } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Send: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Key: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
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
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

interface EmailPasswordResetProps {
  open: boolean;
  onClose: () => void;
}

export default function EmailPasswordReset({ open, onClose }: EmailPasswordResetProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Please enter a user email address
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    if (!isValidEmail(email)) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Please enter a valid email address
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    setIsSending(true);

    try {
      // Call API to send password reset link
      const response = await sendPasswordResetLink(email.trim());

      // Add to sent emails list
      setSentEmails((prev) => [...prev, email.trim()]);
      setEmail("");

      toaster.push(
        <Message showIcon type="success" closable>
          <div>
            <strong>Password reset link sent!</strong>
            <p className="text-xs mt-1">
              Reset link has been sent to {email}
            </p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset link";
      
      toaster.push(
        <Message showIcon type="error" closable>
          <div>
            <strong>Failed to send reset link</strong>
            <p className="text-xs mt-1">{errorMessage}</p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSentEmails([]);
    onClose();
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email.trim() && isValidEmail(email)) {
      handleSendResetLink();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm" className="dark-modal">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--danger-soft)] border border-[var(--danger)]/20 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Key className="w-5 h-5 text-[var(--danger)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Send Password Reset Link
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Send password reset link to user's email
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          {/* User Email Input */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
              <Icons.User className="w-4 h-4" />
              User Email Address
            </Form.ControlLabel>
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              onKeyPress={handleKeyPress}
              placeholder="user@example.com"
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--danger)]"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
              Enter the email address of the user who needs to reset their password
            </Form.HelpText>
            {email && !isValidEmail(email) && (
              <Form.HelpText className="text-xs text-[var(--danger)] mt-1">
                Please enter a valid email address
              </Form.HelpText>
            )}
          </Form.Group>

          {/* Sent Emails List */}
          {sentEmails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[var(--success-soft)] border border-[var(--success)]/20 rounded-lg"
            >
              <div className="flex items-start gap-2 mb-2">
                <Icons.CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--success)] mb-1">
                    Reset links sent to:
                  </p>
                  <div className="space-y-1">
                    {sentEmails.map((sentEmail, index) => (
                      <div
                        key={index}
                        className="text-xs text-[var(--success)] flex items-center gap-1"
                      >
                        <Icons.Mail className="w-3 h-3" />
                        {sentEmail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg mt-4"
          >
            <Icons.AlertCircle className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--text-secondary)]">
              The user will receive an email with a secure link to reset their password. The link will expire in 24 hours.
            </div>
          </motion.div>
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
              Close
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSendResetLink}
              appearance="primary"
              loading={isSending}
              disabled={!email.trim() || !isValidEmail(email)}
              className="!bg-gradient-to-r !from-[var(--danger)] !to-red-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Send Reset Link"}
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

// API function to send password reset link
async function sendPasswordResetLink(email: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/admin/users/password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send password reset link");
  }

  return await response.json();
}
