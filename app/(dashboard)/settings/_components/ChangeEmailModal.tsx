"use client";

import { useState } from "react";
import { Modal, Button, Input, Form } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
  onSave: (newEmail: string) => void;
}

export default function ChangeEmailModal({
  open,
  onClose,
  currentEmail,
  onSave,
}: ChangeEmailModalProps) {
  const [email, setEmail] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!email.trim() || !isValidEmail(email)) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(email);
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setEmail(currentEmail);
    onClose();
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
            className="w-10 h-10 rounded-lg bg-[var(--success-soft)] border border-[var(--success)]/20 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Mail className="w-5 h-5 text-[var(--success)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Update Email Address
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Change your account email address
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary) flex gap-3 justify-end mx-4]">
              Current Email
            </Form.ControlLabel>
            <Input
              value={currentEmail}
              disabled
              className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !border-[var(--border)]"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              New Email Address
            </Form.ControlLabel>
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter new email address"
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--success)]"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
              This email will be used for account notifications and login
            </Form.HelpText>
            {email && !isValidEmail(email) && (
              <Form.HelpText className="text-xs text-[var(--danger)] mt-1">
                Please enter a valid email address
              </Form.HelpText>
            )}
          </Form.Group>
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
              disabled={!email.trim() || !isValidEmail(email) || email === currentEmail}
              className="!bg-gradient-to-r !from-[var(--success)] !to-emerald-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Check className="w-4 h-4" />
                Save Changes
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
