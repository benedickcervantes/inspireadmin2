"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Loader, Pagination, Table } from "rsuite";
import { fadeUpVariant, MotionDiv } from "./motion";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  More: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Activity: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
};

export type TransactionStatus = "Paid" | "Pending" | "Canceled";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  avatar?: string;
  initials?: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    name: "John Doe",
    category: "Salaries",
    date: "March 15, 2024",
    amount: "?1,250.00",
    status: "Paid",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: "2",
    name: "Figma",
    category: "Subscription",
    date: "November 22, 2023",
    amount: "?3,450.00",
    status: "Pending",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg"
  },
  {
    id: "3",
    name: "Office Supplies",
    category: "Operationals",
    date: "January 5, 2025",
    amount: "?2,780.00",
    status: "Canceled",
    initials: "OS"
  }
];

const StatusPill = ({ status }: { status: TransactionStatus }) => {
  const styles = {
    Paid: "bg-[var(--success-soft)] text-[var(--success)] border-[rgba(34,197,94,0.3)]",
    Pending: "bg-[var(--warning-soft)] text-[var(--warning)] border-[rgba(245,158,11,0.3)]",
    Canceled: "bg-[var(--danger-soft)] text-[var(--danger)] border-[rgba(239,68,68,0.3)]"
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full border ${styles[status]} text-[11px] font-medium`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-current"
        animate={{
          scale: status === "Pending" ? [1, 1.2, 1] : 1,
          opacity: status === "Pending" ? [1, 0.6, 1] : 1
        }}
        transition={{
          repeat: status === "Pending" ? Infinity : 0,
          duration: 1.5,
          ease: "easeInOut"   
        }}
      />
      {status}
    </motion.div>
  );
};

interface TransactionTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  pageSize?: number;
  height?: number;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_TABLE_HEIGHT = 320;

export default function TransactionTable({
  transactions: data,
  isLoading = false,
  pageSize = DEFAULT_PAGE_SIZE,
  height = DEFAULT_TABLE_HEIGHT
}: TransactionTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tableData = data ?? transactions;
  const total = tableData.length;
  const [page, setPage] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (isInView && !isLoading) {
      const timer = setTimeout(() => setHasAnimated(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, isLoading]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tableData.slice(start, start + pageSize);
  }, [page, pageSize, tableData]);

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <MotionDiv
        ref={ref}
        variants={fadeUpVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border)] overflow-hidden cursor-pointer ${
          isExpanded ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-6xl z-[9999] max-h-[85vh] overflow-auto shadow-2xl' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
      <motion.div
        className="px-3 pt-3 pb-2 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <Icons.Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
          </motion.div>
          <motion.h3
            className={`font-semibold text-[var(--text-primary)] transition-all duration-300 ${isExpanded ? 'text-xl' : 'text-[13px]'}`}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            Latest Transactions {isExpanded && '(Click to minimize)'}
          </motion.h3>
        </div>
        <motion.button
          className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icons.More className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>

      <motion.div
        className="border-t border-[var(--border-subtle)]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ transformOrigin: "left" }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              className="py-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loader size="sm" content="Loading transactions..." className="!text-[var(--text-muted)]" />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              className="overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Table
                data={pagedData}
                height={isExpanded ? 500 : height}
                rowHeight={isExpanded ? 56 : 44}
                headerHeight={isExpanded ? 40 : 32}
                hover={false}
                className="app-table !bg-transparent"
                rowKey="id"
              >
                <Column flexGrow={1} minWidth={180} align="left">
                  <HeaderCell className={`!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !uppercase !tracking-wide transition-all duration-300 ${isExpanded ? '!text-sm' : '!text-[11px]'}`}>Name</HeaderCell>
                  <Cell className="!bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    {(rowData: Transaction, rowIndex?: number) => (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={!hasAnimated ? { opacity: 0, x: -15 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (rowIndex ?? 0) * 0.05, duration: 0.35 }}
                      >
                        {rowData.avatar ? (
                          <motion.img
                            src={rowData.avatar}
                            alt={rowData.name}
                            className={`rounded-full object-cover border border-[var(--border)] flex-shrink-0 transition-all duration-300 ${isExpanded ? 'w-10 h-10' : 'w-6 h-6'}`}
                            initial={!hasAnimated ? { scale: 0 } : false}
                            animate={{ scale: 1 }}
                            transition={{ delay: (rowIndex ?? 0) * 0.05 + 0.1, type: "spring", stiffness: 300 }}
                            whileHover={{ scale: 1.15, borderColor: "var(--primary)" }}
                          />
                        ) : (
                          <motion.div
                            className={`rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] flex items-center justify-center font-bold border border-[var(--border)] flex-shrink-0 transition-all duration-300 ${isExpanded ? 'w-10 h-10 text-sm' : 'w-6 h-6 text-[10px]'}`}
                            initial={!hasAnimated ? { scale: 0 } : false}
                            animate={{ scale: 1 }}
                            transition={{ delay: (rowIndex ?? 0) * 0.05 + 0.1, type: "spring", stiffness: 300 }}
                            whileHover={{ scale: 1.15 }}
                          >
                            {rowData.initials}
                          </motion.div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className={`font-semibold text-[var(--text-primary)] leading-tight truncate transition-all duration-300 ${isExpanded ? 'text-base' : 'text-[13px]'}`}>{rowData.name}</span>
                          <span className={`text-[var(--text-muted)] truncate transition-all duration-300 ${isExpanded ? 'text-xs' : 'text-[9px]'}`}>{rowData.category}</span>
                        </div>
                      </motion.div>
                    )}
                  </Cell>
                </Column>

                <Column width={130} align="left">
                  <HeaderCell className={`!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !uppercase !tracking-wide transition-all duration-300 ${isExpanded ? '!text-sm' : '!text-[11px]'}`}>Date</HeaderCell>
                  <Cell className="!bg-[var(--surface)] border-b border-[var(--border-subtle)]" dataKey="date">
                    {(rowData: Transaction, rowIndex?: number) => (
                      <motion.span
                        className={`text-[var(--text-secondary)] transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-[12px]'}`}
                        initial={!hasAnimated ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (rowIndex ?? 0) * 0.05 + 0.15, duration: 0.3 }}
                      >
                        {rowData.date}
                      </motion.span>
                    )}
                  </Cell>
                </Column>

                <Column width={120} align="right">
                  <HeaderCell className={`!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !uppercase !tracking-wide transition-all duration-300 ${isExpanded ? '!text-sm' : '!text-[11px]'}`}>Amount</HeaderCell>
                  <Cell className="!bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    {(rowData: Transaction, rowIndex?: number) => (
                      <motion.div
                        className={`font-semibold text-[var(--text-primary)] font-display transition-all duration-300 ${isExpanded ? 'text-lg' : 'text-[13px]'}`}
                        initial={!hasAnimated ? { opacity: 0, scale: 0.9 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (rowIndex ?? 0) * 0.05 + 0.2, duration: 0.3 }}
                      >
                        {rowData.amount}
                      </motion.div>
                    )}
                  </Cell>
                </Column>

                <Column width={100} align="left">
                  <HeaderCell className={`!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !uppercase !tracking-wide transition-all duration-300 ${isExpanded ? '!text-sm' : '!text-[11px]'}`}>Status</HeaderCell>
                  <Cell className="!bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    {(rowData: Transaction) => (
                      <StatusPill status={rowData.status} />
                    )}
                  </Cell>
                </Column>
              </Table>
              {Array.isArray(data) && data.length === 0 && (
                <motion.div
                  className="px-3 py-4 text-[12px] text-[var(--text-muted)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  No recent transactions found.
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="px-3 py-2 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div
              className={`text-[var(--text-muted)] transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-[11px]'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} transactions
            </motion.div>
            <Pagination
              prev
              next
              size="xs"
              total={total}
              limit={pageSize}
              activePage={page}
              onChangePage={setPage}
              className="!m-0 dark-pagination"
            />
          </motion.div>
        )}
      </AnimatePresence>
      </MotionDiv>
    </>
  );
}
