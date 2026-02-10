"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "rsuite";
import CreateTaskModal from "./CreateTaskModal";

type IconProps = React.SVGProps<SVGSVGElement>;

interface TaskFormData {
  taskName: string;
  description: string;
  points: number;
  url: string;
  expirationDate?: Date;
}

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

export default function TaskDashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (taskData: TaskFormData) => {
    console.log("Creating task:", taskData);
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              <Icons.Task className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">Task Management</h1>
              <p className="text-sm text-white/80">Manage user tasks and track completion rates</p>
            </div>
          </div>

          <Button
            appearance="primary"
            onClick={() => setIsModalOpen(true)}
            className="!h-10 !px-4 !rounded-lg !bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
          >
            <span className="flex items-center gap-2">
              <Icons.Plus className="w-4 h-4" />
              Create Task
            </span>
          </Button>
        </div>
      </motion.div>

      <CreateTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
