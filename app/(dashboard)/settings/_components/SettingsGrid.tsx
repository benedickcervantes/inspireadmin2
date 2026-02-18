"use client";

import { motion } from "motion/react";
import SettingsCard from "./SettingsCard";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface SettingsGridProps {
  onCardClick?: (settingId: string) => void;
  currentEmail?: string;
  currentUsername?: string;
}

export default function SettingsGrid({ onCardClick, currentEmail, currentUsername }: SettingsGridProps) {
  const mockSettings: SettingItem[] = [
    {
      id: "1",
      title: "Change Username",
      description: currentUsername || "No username set",
      icon: "user",
      color: "primary",
      enabled: true,
    },
    {
      id: "2",
      title: "Update My Email",
      description: currentEmail || "No email set",
      icon: "mail",
      color: "success",
      enabled: false,
    },
    {
      id: "3",
      title: "Update My Password",
      description: "Change your account password frequently.",
      icon: "lock",
      color: "accent",
      enabled: true,
    },
    {
      id: "4",
      title: "Investment Rate",
      description: "Configure investment return rates (Password Protected)",
      icon: "trendingUp",
      color: "warning",
      enabled: true,
    },
    {
      id: "5",
      title: "Send Push Notification!",
      description: "Broadcast custom notifications to all users",
      icon: "bell",
      color: "info",
      enabled: false,
    },
    {
      id: "6",
      title: "Send Password Reset to Another User",
      description: "Send password reset link to user's email",
      icon: "key",
      color: "danger",
      enabled: true,
    },
    {
      id: "7",
      title: "Maintenance Mode",
      description: "Control system maintenance status",
      icon: "tool",
      color: "primary",
      enabled: true,
    },
    {
      id: "8",
      title: "Post Events!",
      description: "Share events with all users",
      icon: "calendar",
      color: "accent",
      enabled: true,
    },
    {
      id: "9",
      title: "Inspire Wallet Features",
      description: "Track all administrative actions and changes",
      icon: "wallet",
      color: "success",
      enabled: false,
    },
  ];

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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {mockSettings.map((setting, index) => (
        <SettingsCard key={setting.id} setting={setting} index={index} onCardClick={onCardClick} />
      ))}
    </motion.div>
  );
}
