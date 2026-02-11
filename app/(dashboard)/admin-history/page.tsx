"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Table, Pagination, Input, InputGroup, Badge, Message, toaster, Modal, Button } from "rsuite";
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

export default function AdminHistoryPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const [filters, setFilters] = useState<AuditLogsFilters>({
    action: "",
    resourceType: "",
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs({
        ...filters,
        search: searchQuery,
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
  }, [page, filters, searchQuery]);

  const handleFilterChange = (key: keyof AuditLogsFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "red";
    if (actionLower.includes("create") || actionLower.includes("add")) return "green";
    if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("modify")) return "blue";
    if (actionLower.includes("send") || actionLower.includes("email") || actionLower.includes("notify")) return "cyan";
    if (actionLower.includes("login") || actionLower.includes("logout") || actionLower.includes("auth")) return "violet";
    if (actionLower.includes("verify") || actionLower.includes("confirm")) return "orange";
    if (actionLower.includes("cancel") || actionLower.includes("reject")) return "yellow";
    return "gray";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleRowClick = (rowData: AuditLog) => {
    setSelectedLog(rowData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  const getSummary = (log: AuditLog) => {
    const admin = log.adminEmail || log.adminName;
    const action = log.actionLabel || log.action;
    const target = log.metadata?.targetUserName || 'unknown user';
    const targetId = log.metadata?.targetUserId || log.resourceId || '';
    
    let summary = `Admin ${admin} performed action: ${action}`;
    
    if (target && target !== 'unknown user') {
      summary += ` on user ${target}`;
      if (targetId) {
        summary += ` (ID: ${targetId})`;
      }
    }
    
    if (log.metadata?.details) {
      summary += `. ${log.metadata.details}`;
    }
    
    return summary;
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
        <div className="flex flex-col gap-3">
          {/* Search Box */}
          <div className="w-full">
            <InputGroup inside>
              <InputGroup.Addon>
                <Icons.Search className="w-4 h-4" />
              </InputGroup.Addon>
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setPage(1);
                }}
              />
            </InputGroup>
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
          rowHeight={80}
          
          hover
          className="!bg-[var(--surface)]"
          onRowClick={handleRowClick}
          rowClassName="cursor-pointer hover:!bg-[var(--surface-elevated)]"

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
                  {rowData.metadata?.details || 
                   (rowData.metadata?.targetUserName && `Target: ${rowData.metadata.targetUserName}`) ||
                   (rowData.newValue && `Updated to: ${typeof rowData.newValue === 'string' ? rowData.newValue : JSON.stringify(rowData.newValue)}`) ||
                   'No details available'}
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

      {/* Log Details Modal */}
      <Modal open={showModal} onClose={handleCloseModal} size="md">
        <Modal.Header>
          <Modal.Title className="text-2xl font-bold text-[var(--text-primary)]">
            Log Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Timestamp:</p>
                <p className="text-base text-[var(--text-primary)]">{formatDate(selectedLog.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Admin:</p>
                <p className="text-base text-[var(--text-primary)]">{selectedLog.adminEmail}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Action:</p>
                <p className="text-base text-[var(--text-primary)]">{selectedLog.actionLabel || selectedLog.action}</p>
              </div>

              {selectedLog.metadata?.targetUserName && (
                <div>
                  <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Target User:</p>
                  <p className="text-base text-[var(--text-primary)]">{selectedLog.metadata.targetUserName}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Log ID:</p>
                <p className="text-base font-mono text-[var(--text-primary)]">{selectedLog.id}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Summary:</p>
                <div className="bg-[var(--surface-elevated)] p-3 rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">{getSummary(selectedLog)}</p>
                </div>
              </div>

              {selectedLog.adminId && (
                <div>
                  <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Admin Uid:</p>
                  <p className="text-base font-mono text-[var(--text-primary)]">{selectedLog.adminId}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} appearance="primary" className="!bg-blue-600 hover:!bg-blue-700 !m-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}