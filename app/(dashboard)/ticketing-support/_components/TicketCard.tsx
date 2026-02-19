import { motion } from "motion/react";
import { Tag, Button } from "rsuite";
import EyeIcon from "@rsuite/icons/Visible";
import type { Ticket } from "@/lib/api/tickets";

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
  index: number;
}

export default function TicketCard({ ticket, onView, index }: TicketCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "blue";
      case "in-progress":
        return "orange";
      case "resolved":
        return "green";
      case "closed":
        return "gray";
      default:
        return "blue";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
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

      <div className="space-y-3 relative z-10" style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[var(--text-primary)] text-base line-clamp-2 flex-1 min-h-[3rem]">
            {ticket.title}
          </h3>
          <Tag color={getStatusColor(ticket.status)} size="sm">
            {formatStatus(ticket.status)}
          </Tag>
        </div>

        <p className="text-sm text-[var(--text-muted)] line-clamp-3 min-h-[4rem]">
          {ticket.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Tag color={getPriorityColor(ticket.priority)} size="sm">
            {ticket.priority}
          </Tag>
          <span className="text-xs text-[var(--text-muted)]">
            {formatDate(ticket.createdAt)}
          </span>
        </div>

        <div className="text-xs text-[var(--text-muted)] space-y-1">
          <p>
            <span className="font-medium">Customer:</span> {ticket.customerName}
          </p>
          <p>
            <span className="font-medium">Category:</span> {ticket.category}
          </p>
          {ticket.assignedTo && ticket.assignedTo !== "Unassigned" && (
            <p>
              <span className="font-medium">Assigned:</span> {ticket.assignedTo}
            </p>
          )}
        </div>

        <Button
          appearance="primary"
          color="blue"
          block
          startIcon={<EyeIcon />}
          onClick={() => onView(ticket)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}
