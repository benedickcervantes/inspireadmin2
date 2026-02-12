"use client";

import { useState } from "react";
import { Modal, Button, Input, Form, Message, toaster, Toggle } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Tool: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  AlertTriangle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Info: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

interface MaintenanceModeProps {
  open: boolean;
  onClose: () => void;
}

export default function MaintenanceMode({ open, onClose }: MaintenanceModeProps) {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("maintenanceMode") === "true";
    }
    return false;
  });
  const [message, setMessage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("maintenanceMessage") || "";
    }
    return "";
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Call API to update maintenance mode
      const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/settings/maintenance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isEnabled: isEnabled,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update maintenance mode");
      }

      // Save to localStorage as cache
      localStorage.setItem("maintenanceMode", isEnabled.toString());
      localStorage.setItem("maintenanceMessage", message.trim());

      setIsSaving(false);

      toaster.push(
        <Message showIcon type="success" closable>
          <div>
            <strong>Maintenance mode updated!</strong>
            <p className="text-xs mt-1">
              {isEnabled ? "Maintenance mode is now active" : "Maintenance mode is now disabled"}
            </p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );

      handleClose();
    } catch (error) {
      setIsSaving(false);

      const errorMessage = error instanceof Error ? error.message : "Failed to update maintenance mode";

      toaster.push(
        <Message showIcon type="error" closable>
          <div>
            <strong>Failed to update maintenance mode</strong>
            <p className="text-xs mt-1">{errorMessage}</p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    }
  };

  const handleClose = () => {
    // Reset to saved values
    if (typeof window !== "undefined") {
      setIsEnabled(localStorage.getItem("maintenanceMode") === "true");
      setMessage(localStorage.getItem("maintenanceMessage") || "");
    }
    onClose();
  };

  const characterCount = {
    message: message.length,
    messageMax: 200,
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm" className="dark-modal">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Tool className="w-5 h-5 text-[var(--primary)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Maintenance Mode
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Control system maintenance status
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] mb-4 mt-4 mx-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isEnabled 
                  ? 'bg-[var(--warning-soft)] border border-[var(--warning)]/20' 
                  : 'bg-[var(--success-soft)] border border-[var(--success)]/20'
              }`}>
                {isEnabled ? (
                  <Icons.AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                ) : (
                  <Icons.Check className="w-4 h-4 text-[var(--success)]" />
                )}
              </div>
              <div className="ml-1 mt-0.5">
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  {isEnabled ? "Maintenance Active" : "System Online"}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                  {isEnabled ? "Users cannot access the system" : "All systems operational"}
                </p>
              </div>
            </div>
            <Toggle
              checked={isEnabled}
              onChange={setIsEnabled}
              size="md"
            />
          </div>

          {/* Maintenance Message */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Maintenance Message
            </Form.ControlLabel>
            <Input
              as="textarea"
              rows={4}
              value={message}
              onChange={setMessage}
              placeholder="Enter a message to display to users during maintenance"
              maxLength={characterCount.messageMax}
              disabled={!isEnabled}
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--primary)] !resize-none"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
              <span>This message will be shown to users</span>
              <span className={characterCount.message > characterCount.messageMax * 0.9 ? 'text-[var(--warning)]' : ''}>
                {characterCount.message}/{characterCount.messageMax}
              </span>
            </Form.HelpText>
          </Form.Group>

          {/* Warning */}
          {isEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 bg-[var(--warning-soft)] border border-[var(--warning)]/20 rounded-lg"
            >
              <Icons.AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--warning)]">
                <strong>Warning:</strong> Enabling maintenance mode will prevent all users from accessing the system. Only administrators will be able to log in.
              </div>
            </motion.div>
          )}

          {/* Info */}
          {!isEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg"
            >
              <Icons.Info className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--text-secondary)]">
                Use maintenance mode when performing system updates, database migrations, or critical fixes that require downtime.
              </div>
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
              loading={isSaving}
              className={`!bg-gradient-to-r ${
                isEnabled 
                  ? '!from-[var(--warning)] !to-amber-500' 
                  : '!from-[var(--primary)] !to-[var(--accent)]'
              } hover:!shadow-lg`}
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
