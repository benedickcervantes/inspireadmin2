"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Table, Pagination, SelectPicker, DateRangePicker, Input, InputGroup, Badge, Message, toaster } from "rsuite";
import { getAuditLogs, type AuditLog, type AuditLogsFilters } from "@/lib/api/auditLogs";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  Filter: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
};

const ACTION_TYPES = [
  { label: "All Actions", value: "" },
  { label: "Update Username", value: "UPDATE_USERNAME" },
  { label: "Update Email", value: "UPDATE_EMAIL" },
  { label: "Update Password", value: "UPDATE_PASSWORD" },
  { label: "Update Investment Rates", value: "UPDATE_INVESTMENT_RATES" },
  { label: "Send Notification", value: "SEND_NOTIFICATION" },
  { label: "Send Password Reset", value: "SEND_PASSWORD_RESET" },
  { label: "Update Maintenance Mode", value: "UPDATE_MAINTENANCE_MODE" },
  { label: "Post Event", value: "POST_EVENT" },
  { label: "Create User", value: "CREATE_USER" },
  { label: "Update User", value: "UPDATE_USER" },
  { label: "Delete User", value: "DELETE_USER" },
  { label: "Login", value: "LOGIN" },
  { label: "Logout", value: "LOGOUT" },
];

const RESOURCE_TYPES = [
  { label: "All Resources", value: "" },
  { label: "Profile", value: "PROFILE" },
  { label: "Settings", value: "SETTINGS" },
  { label: "Notification", value: "NOTIFICATION" },
  { label: "User", value: "USER" },
  { label: "Event", value: "EVENT" },
];

export default function AdminHistoryPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState<AuditLogsFilters>({
    action: "",
    resourceType: "",
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs({
        ...filters,
        page,
        limit,
      });
      setLogs(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch audit logs";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const handleFilterChange = (key: keyof AuditLogsFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const getActionColor = (action: string) => {
    if (action.includes("DELETE")) return "red";
    if (action.includes("CREATE")) return "green";
    if (action.includes("UPDATE")) return "blue";
    if (action.includes("SEND")) return "cyan";
    if (action.includes("LOGIN")) return "violet";
    return "gray";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center shadow-[var(--shadow-glow-purple)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icons.FileText className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-google-sans)]">
              Admin History Logs
            </h1>
            <p className="text-sm text-[var(--text-muted)] font-[var(--font-quest-trial)]">
              Track all administrative actions and changes
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SelectPicker
              data={ACTION_TYPES}
              value={filters.action}
              onChange={(value) => handleFilterChange("action", value)}
              placeholder="Filter by Action"
              cleanable={false}
              searchable={false}
              className="!w-full"
            />
          </div>
          <div className="flex-1">
            <SelectPicker
              data={RESOURCE_TYPES}
              value={filters.resourceType}
              onChange={(value) => handleFilterChange("resourceType", value)}
              placeholder="Filter by Resource"
              cleanable={false}
              searchable={false}
              className="!w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Table
          data={logs}
          loading={loading}
          height={600}
          hover
          className="!bg-[var(--surface)]"
        >
          <Column width={180} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Date & Time
            </HeaderCell>
            <Cell dataKey="createdAt">
              {(rowData: AuditLog) => (
                <span className="text-xs text-[var(--text-secondary)]">
                  {formatDate(rowData.createdAt)}
                </span>
              )}
            </Cell>
          </Column>

          <Column width={150} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Admin
            </HeaderCell>
            <Cell dataKey="adminName">
              {(rowData: AuditLog) => (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {rowData.adminName}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {rowData.adminEmail}
                  </span>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={200} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Action
            </HeaderCell>
            <Cell dataKey="actionLabel">
              {(rowData: AuditLog) => (
                <Badge content={rowData.actionLabel} color={getActionColor(rowData.action)} />
              )}
            </Cell>
          </Column>

          <Column width={120} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Resource
            </HeaderCell>
            <Cell dataKey="resourceType">
              {(rowData: AuditLog) => (
                <span className="text-xs text-[var(--text-secondary)]">
                  {rowData.resourceType}
                </span>
              )}
            </Cell>
          </Column>

          <Column width={150} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              IP Address
            </HeaderCell>
            <Cell dataKey="ipAddress">
              {(rowData: AuditLog) => (
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {rowData.ipAddress}
                </span>
              )}
            </Cell>
          </Column>

          <Column flexGrow={1} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Details
            </HeaderCell>
            <Cell>
              {(rowData: AuditLog) => (
                <div className="text-xs text-[var(--text-muted)] truncate">
                  {rowData.metadata && JSON.stringify(rowData.metadata)}
                  {rowData.newValue && `New: ${JSON.stringify(rowData.newValue)}`}
                </div>
              )}
            </Cell>
          </Column>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          <div className="text-sm text-[var(--text-muted)]">
            Showing {logs.length} of {total} logs
          </div>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="sm"
            layout={["total", "-", "pager"]}
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}
