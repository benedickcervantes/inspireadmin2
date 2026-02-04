"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "rsuite";
import CreateTaskModal from "./CreateTaskModal";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Task: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

interface TaskFormData {
  taskName: string;
  description: string;
  points: number;
  url: string;
  expirationDate?: Date;
}

export default function TaskDashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (taskData: TaskFormData) => {
    console.log("Creating task:", taskData);
    // Here you would typically send the data to your API
    // For now, we'll just log it
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icons.Task className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1
                className="text-xl font-bold text-white font-[var(--font-google-sans)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Task Dashboard
              </motion.h1>
              <motion.p
                className="text-sm text-white/80 font-[var(--font-quest-trial)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Manage user tasks and track completion rates
              </motion.p>
            </div>
          </div>

          {/* Create Task Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              appearance="primary"
              onClick={() => setIsModalOpen(true)}
              className="!h-10 !px-4 !rounded-lg !bg-white/20 !border-white/30 !text-white hover:!bg-white/30 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <Icons.Plus className="w-4 h-4" />
                Create Task
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}