"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Modal, Input, Button, InputGroup, DatePicker } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Star: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Link: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
}

interface TaskFormData {
  taskName: string;
  description: string;
  points: number;
  url: string;
  expirationDate?: Date;
}

export default function CreateTaskModal({ open, onClose, onSubmit }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    taskName: "",
    description: "",
    points: 0,
    url: "",
    expirationDate: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskName.trim()) {
      newErrors.taskName = "Task name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.points || formData.points <= 0) {
      newErrors.points = "Points must be greater than 0";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Show success message (you can integrate with a toast system here)
      console.log("Task created successfully!");
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      taskName: "",
      description: "",
      points: 0,
      url: "",
      expirationDate: undefined,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      className="create-task-modal"
    >
      <Modal.Header className="!p-0 !border-0">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-lg font-bold font-[var(--font-google-sans)] mb-1">
            Create New Task
          </h2>
          <p className="text-sm text-white/80 font-[var(--font-quest-trial)]">
            Add a new task for users to complete
          </p>
        </motion.div>
      </Modal.Header>

      <Modal.Body className="!p-6 !bg-[var(--surface)]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-[var(--font-quest-trial)]">
              Task Name <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              placeholder="Enter task name"
              value={formData.taskName}
              onChange={(value) => handleInputChange("taskName", value)}
              className={`!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-10 ${
                errors.taskName ? "!border-[var(--danger)]" : ""
              }`}
            />
            {errors.taskName && (
              <motion.p
                className="text-xs text-[var(--danger)] mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.taskName}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-[var(--font-quest-trial)]">
              Description <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              as="textarea"
              rows={3}
              placeholder="Describe the task in detail"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              className={`!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg resize-none ${
                errors.description ? "!border-[var(--danger)]" : ""
              }`}
            />
            {errors.description && (
              <motion.p
                className="text-xs text-[var(--danger)] mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.description}
              </motion.p>
            )}
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-[var(--font-quest-trial)]">
              Points <span className="text-[var(--danger)]">*</span>
            </label>
            <InputGroup inside className={`!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-10 ${
              errors.points ? "!border-[var(--danger)]" : ""
            }`}>
              <InputGroup.Addon className="!bg-transparent !text-[var(--warning)]">
                <Icons.Star className="h-4 w-4 fill-current" />
              </InputGroup.Addon>
              <Input
                type="number"
                placeholder="Enter points value"
                value={formData.points || ""}
                onChange={(value) => handleInputChange("points", parseInt(value) || 0)}
                className="!bg-transparent !border-0"
              />
            </InputGroup>
            {errors.points && (
              <motion.p
                className="text-xs text-[var(--danger)] mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.points}
              </motion.p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-[var(--font-quest-trial)]">
              Link (URL) <span className="text-[var(--danger)]">*</span>
            </label>
            <InputGroup inside className={`!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-10 ${
              errors.url ? "!border-[var(--danger)]" : ""
            }`}>
              <InputGroup.Addon className="!bg-transparent !text-[var(--primary)]">
                <Icons.Link className="h-4 w-4" />
              </InputGroup.Addon>
              <Input
                placeholder="https://facebook.com/yourpage"
                value={formData.url}
                onChange={(value) => handleInputChange("url", value)}
                className="!bg-transparent !border-0"
              />
            </InputGroup>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-[var(--font-quest-trial)]">
              Enter the page URL to follow or post to like
            </p>
            {errors.url && (
              <motion.p
                className="text-xs text-[var(--danger)] mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.url}
              </motion.p>
            )}
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-[var(--font-quest-trial)]">
              Expiration Date <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <InputGroup inside className="!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-10">
              <InputGroup.Addon className="!bg-transparent !text-[var(--text-muted)]">
                <Icons.Calendar className="h-4 w-4" />
              </InputGroup.Addon>
              <DatePicker
                placeholder="dd/mm/yyyy"
                value={formData.expirationDate}
                onChange={(value) => handleInputChange("expirationDate", value)}
                className="!bg-transparent !border-0 !w-full"
                format="dd/MM/yyyy"
                cleanable={false}
              />
            </InputGroup>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-[var(--font-quest-trial)]">
              Leave empty for no expiration
            </p>
          </div>
        </motion.div>
      </Modal.Body>

      <Modal.Footer className="!p-6 !pt-4 !bg-[var(--surface)] !border-t !border-[var(--border)]">
        <motion.div
          className="flex items-center justify-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Button
            appearance="subtle"
            onClick={handleClose}
            className="!px-6 !py-2 !rounded-lg !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)] !border-[var(--border)]"
          >
            Cancel
          </Button>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              appearance="primary"
              onClick={handleSubmit}
              className="!px-6 !py-2 !rounded-lg !bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!opacity-90 !border-0 !shadow-md"
            >
              Create Task
            </Button>
          </motion.div>
        </motion.div>
      </Modal.Footer>
    </Modal>
  );
}