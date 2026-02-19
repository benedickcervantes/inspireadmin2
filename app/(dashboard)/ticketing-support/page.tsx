"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader, Message } from "rsuite";
import { getTickets, type Ticket, type TicketStats } from "@/lib/api/tickets";
import TicketHeader from "./_components/TicketHeader";
import PendingTickets from "./_components/PendingTickets";
import AssignedTickets from "./_components/AssignedTickets";

export default function TicketingSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    pending: 0,
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const [viewMode, setViewMode] = useState<"my-tickets" | "all">("all"); // Default to "all" for superadmin
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const result = await getTickets({
        page,
        limit,
        status: selectedStatus,
        viewMode,
      });

      if (result.success) {
        setTickets(result.data.tickets);
        setPendingTickets(result.data.pendingTickets);
        setStats(result.data.stats);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch tickets");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, selectedStatus, viewMode]);

  const handleRefresh = () => {
    fetchTickets(false);
  };

  const handleStatusChange = (status: "all" | "open" | "in-progress" | "resolved") => {
    setSelectedStatus(status);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" content="Loading tickets..." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <TicketHeader
        stats={stats}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Message showIcon type="error" header="Error">
            {error}
          </Message>
        </motion.div>
      )}

      {/* Pending Tickets Section */}
      {pendingTickets.length > 0 && (
        <PendingTickets
          tickets={pendingTickets}
          onRefresh={handleRefresh}
        />
      )}

      {/* Assigned Tickets Section */}
      <AssignedTickets
        tickets={tickets}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        stats={stats}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={handleRefresh}
        viewMode={viewMode}
      />
    </div>
  );
}
