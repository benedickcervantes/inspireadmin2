import { motion } from "motion/react";
import { Panel, Nav, Pagination } from "rsuite";
import { useState } from "react";
import TicketCard from "./TicketCard";
import TicketDetailDrawer from "./TicketDetailDrawer";
import type { Ticket, TicketStats } from "@/lib/api/tickets";

interface AssignedTicketsProps {
  tickets: Ticket[];
  selectedStatus: "all" | "open" | "in-progress" | "resolved";
  onStatusChange: (status: "all" | "open" | "in-progress" | "resolved") => void;
  stats: TicketStats;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  viewMode: "my-tickets" | "all";
}

export default function AssignedTickets({
  tickets,
  selectedStatus,
  onStatusChange,
  stats,
  page,
  totalPages,
  onPageChange,
  onRefresh,
  viewMode,
}: AssignedTicketsProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = [
    { id: "all" as const, label: "All", count: stats.total },
    { id: "open" as const, label: "Open", count: stats.open },
    { id: "in-progress" as const, label: "In Progress", count: stats.inProgress },
    { id: "resolved" as const, label: "Resolved", count: stats.resolved },
  ];

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketUpdate = () => {
    onRefresh();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Panel bordered className="bg-[var(--surface)] shadow-sm">
          {/* Tabs */}
          <Nav
            appearance="subtle"
            activeKey={selectedStatus}
            onSelect={(key) => onStatusChange(key as any)}
            className="mb-6"
          >
            {tabs.map((tab) => (
              <Nav.Item key={tab.id} eventKey={tab.id}>
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-soft)] text-[var(--text-muted)]">
                  {tab.count}
                </span>
              </Nav.Item>
            ))}
          </Nav>

          {/* Tickets Grid */}
          {tickets.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tickets.map((ticket, index) => (
                  <TicketCard
                    key={`${ticket.id}-${ticket.userId}`}
                    ticket={ticket}
                    onView={handleViewTicket}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="md"
                    layout={["total", "-", "pager"]}
                    total={stats.total}
                    limit={20}
                    activePage={page}
                    onChangePage={onPageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-soft)] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-[var(--text-muted)] text-lg font-medium">
                {viewMode === "my-tickets"
                  ? "No tickets assigned to you"
                  : "No tickets found"}
              </p>
              <p className="text-[var(--text-muted)] text-sm mt-2">
                {viewMode === "my-tickets"
                  ? "Tickets will appear here when you claim them from the pending section above"
                  : "Tickets will appear here when agents claim them"}
              </p>
            </div>
          )}
        </Panel>
      </motion.div>

      {/* Ticket Detail Drawer */}
      <TicketDetailDrawer
        open={drawerOpen}
        ticket={selectedTicket}
        onClose={handleCloseDrawer}
        onUpdate={handleTicketUpdate}
      />
    </>
  );
}
