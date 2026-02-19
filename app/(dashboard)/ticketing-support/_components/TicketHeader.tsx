import { motion } from "motion/react";
import { Panel, Button, ButtonGroup } from "rsuite";
import ReloadIcon from "@rsuite/icons/Reload";
import type { TicketStats } from "@/lib/api/tickets";

interface TicketHeaderProps {
  stats: TicketStats;
  refreshing: boolean;
  onRefresh: () => void;
  viewMode: "my-tickets" | "all";
  onViewModeChange: (mode: "my-tickets" | "all") => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TicketHeader({
  stats,
  refreshing,
  onRefresh,
  viewMode,
  onViewModeChange,
}: TicketHeaderProps) {
  const statCards = [
    {
      title: "Pending Tickets",
      value: stats.pending,
      color: "bg-[var(--surface)]",
      iconColor: "text-[var(--text-primary)]",
    },
    {
      title: viewMode === "my-tickets" ? "My Assigned" : "All Tickets",
      value: stats.total,
      color: "bg-[var(--surface)]",
      iconColor: "text-[var(--text-primary)]",
    },
    {
      title: "Open",
      value: stats.open,
      color: "bg-[var(--surface)]",
      iconColor: "text-[var(--text-primary)]",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      color: "bg-[var(--surface)]",
      iconColor: "text-[var(--text-primary)]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Ticketing Support
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Manage customer support tickets and requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ButtonGroup>
            <Button
              appearance={viewMode === "my-tickets" ? "primary" : "default"}
              onClick={() => onViewModeChange("my-tickets")}
            >
              My Tickets
            </Button>
            <Button
              appearance={viewMode === "all" ? "primary" : "default"}
              onClick={() => onViewModeChange("all")}
            >
              All Tickets
            </Button>
          </ButtonGroup>
          <Button
            appearance="primary"
            color="blue"
            startIcon={<ReloadIcon spin={refreshing} />}
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{
                x: "100%",
                opacity: [0, 0.1, 0],
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                transform: "skewX(-20deg)"
              }}
            />

            <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
              <motion.div
                className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
              >
                {stat.title}
              </motion.div>
              <motion.div
                className="text-2xl font-bold text-[var(--text-primary)] mt-1 font-display"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {stat.value.toLocaleString()}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
