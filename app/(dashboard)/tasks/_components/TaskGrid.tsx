"use client";

import React from "react";
import { motion } from "motion/react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  url: string;
  completed: number;
  notCompleted: number;
  totalUsers: number;
  completionRate: number;
  status: "active" | "inactive";
}

// Mock data based on the image
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow us on FB!",
    description: "Follow Inspire Next Global Inc. on Facebook and get 3 points!",
    points: 3,
    url: "https://www.facebook.com/inspirenextglobal",
    completed: 60,
    notCompleted: 536,
    totalUsers: 596,
    completionRate: 10,
    status: "active",
  },
  {
    id: "2",
    title: "Follow Inspire Next Global Inc. on Instagram !!!",
    description: "📸 Follow us on Instagram! Stay connected and be part of our journey of growth, innovation, and inspiration. 🚀 Follow Inspire Next Global Inc. on...",
    points: 2,
    url: "https://www.instagram.com/inspirenextglobal",
    completed: 43,
    notCompleted: 553,
    totalUsers: 596,
    completionRate: 7,
    status: "active",
  },
  {
    id: "3",
    title: "Follow our TikTok Account !!!",
    description: "📱 Follow us on TikTok! Catch fun moments, event highlights, and inspiring stories - all in one place! 🎬 Follow our TikTok account today and join the...",
    points: 3,
    url: "https://www.tiktok.com/@inspire.group?_r...",
    completed: 41,
    notCompleted: 555,
    totalUsers: 596,
    completionRate: 7,
    status: "active",
  },
  {
    id: "4",
    title: "Follow Inspire Holdings Inc. on Instagram !!!",
    description: "📸 Follow us on Instagram! Stay updated with our latest events, highlights, and inspiring moments — 🚀 Follow Inspire Holdings Inc. on Instagram today! 📸",
    points: 2,
    url: "https://www.instagram.com/inspire.holdin",
    completed: 40,
    notCompleted: 556,
    totalUsers: 596,
    completionRate: 7,
    status: "active",
  },
  {
    id: "5",
    title: "Follow Inspire Holdings on Facebook!",
    description: "Follow Inspire Holdings Inc. on Facebook and get 3 points!",
    points: 3,
    url: "https://www.facebook.com/inspireholdings",
    completed: 53,
    notCompleted: 543,
    totalUsers: 596,
    completionRate: 9,
    status: "active",
  },
  {
    id: "6",
    title: "Follow Inspire Beauty on Facebook!",
    description: "Follow our page IBeauty on Facebook!",
    points: 2,
    url: "https://www.facebook.com/profile.php?id=...",
    completed: 52,
    notCompleted: 544,
    totalUsers: 596,
    completionRate: 9,
    status: "active",
  },
];

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
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {mockTasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </motion.div>
  );
}