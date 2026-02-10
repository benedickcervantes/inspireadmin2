"use client";

import { useState } from "react";
import { Modal, Button, Input, Form, Message, toaster } from "rsuite";
import { motion } from "motion/react";
import { sendPushNotification } from "@/lib/api/notifications";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Bell: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Send: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

interface CustomPushNotifProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomPushNotif({ open, onClose }: CustomPushNotifProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !description.trim()) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Please fill in both title and description
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    setIsSending(true);

    try {
      // Send notification via API
      const response = await sendPushNotification({
        title: title.trim(),
        description: description.trim(),
        sendToAll: true,
      });

      // Save to local notification history for reference
      const notification = {
        id: Date.now().toString(),
        title,
        description,
        sentAt: new Date().toISOString(),
        sentBy: "Admin",
        sentCount: response.sentCount || 0,
        failedCount: response.failedCount || 0,
      };

      const history = JSON.parse(localStorage.getItem("notificationHistory") || "[]");
      history.unshift(notification);
      localStorage.setItem("notificationHistory", JSON.stringify(history.slice(0, 50)));

      setIsSending(false);

      toaster.push(
        <Message showIcon type="success" closable>
          <div>
            <strong>Notification sent successfully!</strong>
            <p className="text-xs mt-1">
              Delivered to {response.sentCount || 0} users
              {response.failedCount ? ` (${response.failedCount} failed)` : ""}
            </p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );

      handleClose();
    } catch (error) {
      setIsSending(false);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to send notification";
      
      toaster.push(
        <Message showIcon type="error" closable>
          <div>
            <strong>Failed to send notification</strong>
            <p className="text-xs mt-1">{errorMessage}</p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setShowPreview(false);
    onClose();
  };

  const characterCount = {
    title: title.length,
    description: description.length,
    titleMax: 50,
    descriptionMax: 200,
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" className="dark-modal">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--info)] bg-opacity-10 border border-[var(--info)]/20 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Bell className="w-5 h-5 text-[var(--info)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Send Push Notification
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
              <Icons.Users className="w-3 h-3" />
              Broadcast to all users
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          {/* Notification Title */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Notification Title
            </Form.ControlLabel>
            <Input
              value={title}
              onChange={setTitle}
              placeholder="Enter notification title"
              maxLength={characterCount.titleMax}
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--info)]"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
              <span>Keep it short and attention-grabbing</span>
              <span className={characterCount.title > characterCount.titleMax * 0.9 ? 'text-[var(--warning)]' : ''}>
                {characterCount.title}/{characterCount.titleMax}
              </span>
            </Form.HelpText>
          </Form.Group>

          {/* Notification Description */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Notification Description
            </Form.ControlLabel>
            <Input
              as="textarea"
              rows={4}
              value={description}
              onChange={setDescription}
              placeholder="Enter notification message"
              maxLength={characterCount.descriptionMax}
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--info)] !resize-none"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
              <span>Provide clear and concise information</span>
              <span className={characterCount.description > characterCount.descriptionMax * 0.9 ? 'text-[var(--warning)]' : ''}>
                {characterCount.description}/{characterCount.descriptionMax}
              </span>
            </Form.HelpText>
          </Form.Group>

          {/* Preview Toggle */}
          <div className="flex items-center justify-between p-3 bg-[var(--surface-soft)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Icons.Eye className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-secondary)]">Preview Notification</span>
            </div>
            <Button
              size="xs"
              appearance="subtle"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!title.trim() && !description.trim()}
              className="!text-[var(--info)]"
            >
              {showPreview ? "Hide" : "Show"}
            </Button>
          </div>

          {/* Preview */}
          {showPreview && (title.trim() || description.trim()) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border)] shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--info)] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <Icons.Bell className="w-5 h-5 text-[var(--info)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    {title || "Notification Title"}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] break-words">
                    {description || "Notification description will appear here"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Just now</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 bg-[var(--warning-soft)] border border-[var(--warning)]/20 rounded-lg"
          >
            <Icons.AlertCircle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--warning)]">
              <strong>Important:</strong> This notification will be sent to all registered users immediately. Please review carefully before sending.
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
              disabled={isSending}
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSend}
              appearance="primary"
              loading={isSending}
              disabled={!title.trim() || !description.trim()}
              className="!bg-gradient-to-r !from-[var(--info)] !to-blue-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Send className="w-4 h-4" />
                Send Notification
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
