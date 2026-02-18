"use client";

import React from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "rsuite";
import { getTasks, type Task } from "@/lib/api/subcollections";
import TaskCard from "./TaskCard";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function TaskGrid() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks({ page: 1, limit: 100 }),
    staleTime: 30000, // 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader size="md" content="Loading tasks..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading tasks</div>
          <div className="text-sm text-gray-500">
            {error instanceof Error ? error.message : "Failed to fetch tasks"}
          </div>
        </div>
      </div>
    );
  }

  const tasks = (data?.data?.items ?? []) as Task[];

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center text-gray-500">No tasks available</div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tasks.map((task, index) => (
        <TaskCard key={task._firebaseDocId} task={task} index={index} />
      ))}
    </motion.div>
  );
}
