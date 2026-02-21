"use client";

import React, { useState } from "react";
import { Modal, Button, Input, toaster } from "rsuite";
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
};

interface SendEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SendEmailModal({ open, onClose }: SendEmailModalProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!email.trim() || !subject.trim() || !message.trim()) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Validation Error</div>
          <div>Please fill in email address, subject and message</div>
        </div>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual email sending logic here
    // For now, just simulate a delay
    setTimeout(() => {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Success</div>
          <div>Email sent successfully to all users</div>
        </div>,
        { placement: "topEnd", duration: 4000 }
      );
      
      setIsSubmitting(false);
      setEmail("");
      setSubject("");
      setMessage("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail("");
      setSubject("");
      setMessage("");
      onClose();
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      className="dark-modal"
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Mail className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Send Email 
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Compose and send an email 
            </p>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email Address 
            </label>
            <Input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={setEmail}
              disabled={isSubmitting}
              className="!bg-[var(--surface-soft)] !border-[var(--border)] !text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Subject
            </label>
            <Input
              placeholder="Enter email subject"
              value={subject}
              onChange={setSubject}
              disabled={isSubmitting}
              className="!bg-[var(--surface-soft)] !border-[var(--border)] !text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Message
            </label>
            <Input
              as="textarea"
              rows={6}
              placeholder="Enter your message"
              value={message}
              onChange={setMessage}
              disabled={isSubmitting}
              className="!bg-[var(--surface-soft)] !border-[var(--border)] !text-[var(--text-primary)]"
            />
          </div>

          <div className="text-xs text-[var(--text-muted)] bg-[var(--surface-soft)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <strong>Note:</strong> This email will be sent to all selected users in the system.
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="!bg-[var(--surface)] !border-t !border-[var(--border)] !pt-4 !pb-4">
        <div className="flex gap-3 justify-end mx-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleClose}
              appearance="subtle"
              disabled={isSubmitting}
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSend}
              appearance="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Send Email"}
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
