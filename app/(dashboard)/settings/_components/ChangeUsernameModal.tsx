"use client";

import { useState } from "react";
import { Modal, Button, Input, Form } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface ChangeUsernameModalProps {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
  onSave: (newUsername: string) => void;
}

export default function ChangeUsernameModal({
  open,
  onClose,
  currentUsername,
  onSave,
}: ChangeUsernameModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(username);
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setUsername(currentUsername);
    onClose();
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
            className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.User className="w-5 h-5 text-[var(--primary)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Change Username
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Update your display name
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Current Username
            </Form.ControlLabel>
            <Input
              value={currentUsername}
              disabled
              className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !border-[var(--border)]"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              New Username
            </Form.ControlLabel>
            <Input
              value={username}
              onChange={setUsername}
              placeholder="Enter new username"
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--primary)]"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
              This will be displayed in the sidebar and throughout the app
            </Form.HelpText>
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
              disabled={!username.trim() || username === currentUsername}
              className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!shadow-[var(--shadow-glow-cyan)]"
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
