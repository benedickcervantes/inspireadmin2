import { motion } from "motion/react";
import { Panel, Tag, Button } from "rsuite";
import { useState } from "react";
import { assignTicket, type Ticket } from "@/lib/api/tickets";
import { Message, toaster } from "rsuite";

interface PendingTicketsProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export default function PendingTickets({ tickets, onRefresh }: PendingTicketsProps) {
  const [assigning, setAssigning] = useState<string | null>(null);

  const handleTakeTicket = async (ticket: Ticket) => {
    try {
      setAssigning(ticket.id);
      await assignTicket(ticket.id, ticket.userId, "open");
      
      toaster.push(
        <Message showIcon type="success">
          Ticket assigned successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      onRefresh();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to assign ticket"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setAssigning(null);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Panel
        bordered
        className="bg-[var(--surface)] shadow-sm"
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Available Tickets to Claim
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {tickets.length} pending tickets available for assignment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-600">Live Updates</span>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={`${ticket.id}-${ticket.userId}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-[var(--surface)] rounded-xl border-2 border-purple-200 dark:border-purple-800 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--text-primary)] text-base line-clamp-2 min-h-[3rem]">
                  {ticket.title}
                </h3>
                
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
                </div>

                <Button
                  appearance="primary"
                  color="blue"
                  block
                  onClick={() => handleTakeTicket(ticket)}
                  loading={assigning === ticket.id}
                  disabled={assigning !== null}
                >
                  {assigning === ticket.id ? "Taking..." : "Take Ticket"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}
