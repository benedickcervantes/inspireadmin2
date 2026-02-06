"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Modal, Input, Button } from "rsuite";

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
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
    <Modal open={open} onClose={handleClose} size="sm">
      <Modal.Header className="!p-0 !border-0">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-bold">Create New Task</h2>
          <p className="text-sm text-white/80">Add a new task for users to complete</p>
        </motion.div>
      </Modal.Header>

      <Modal.Body className="!p-6 !bg-[var(--surface)]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Task Name <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              placeholder="Enter task name"
              value={formData.taskName}
              onChange={(value) => handleInputChange("taskName", value)}
              className={errors.taskName ? "!border-[var(--danger)]" : ""}
            />
            {errors.taskName && <p className="text-xs text-[var(--danger)] mt-1">{errors.taskName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Description <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              as="textarea"
              rows={3}
              placeholder="Describe the task"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              className={errors.description ? "!border-[var(--danger)]" : ""}
            />
            {errors.description && <p className="text-xs text-[var(--danger)] mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Points <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              type="number"
              placeholder="Enter points"
              value={formData.points || ""}
              onChange={(value) => handleInputChange("points", parseInt(value) || 0)}
              className={errors.points ? "!border-[var(--danger)]" : ""}
            />
            {errors.points && <p className="text-xs text-[var(--danger)] mt-1">{errors.points}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              URL <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              placeholder="https://example.com"
              value={formData.url}
              onChange={(value) => handleInputChange("url", value)}
              className={errors.url ? "!border-[var(--danger)]" : ""}
            />
            {errors.url && <p className="text-xs text-[var(--danger)] mt-1">{errors.url}</p>}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">Cancel</Button>
        <Button onClick={handleSubmit} appearance="primary">Create Task</Button>
      </Modal.Footer>
    </Modal>
  );
}
