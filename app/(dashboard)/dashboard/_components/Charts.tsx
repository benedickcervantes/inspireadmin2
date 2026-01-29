"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Loader } from "rsuite";
import { formatCurrency } from "@/lib/utils/formatters";
import { scaleFade, fadeUpVariant, MotionDiv } from "./motion";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  More: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  PieChart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  Wallet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
      <path d="M3 15h6" />
      <path d="M6 12v6" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Box: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Activity: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
};

export interface OutflowItem {
  label: string;
  amount: number;
  detail?: string;
  icon?: React.ReactNode;
}

const outflowData: OutflowItem[] = [
  { label: "Vendor Payments", amount: 9450, detail: "Category description here...", icon: <Icons.Wallet className="w-3.5 h-3.5" /> },
  { label: "Employee Salaries", amount: 8600, detail: "Category description here...", icon: <Icons.Users className="w-3.5 h-3.5" /> },
  { label: "Software Subscriptions", amount: 3120, detail: "Category description here...", icon: <Icons.Box className="w-3.5 h-3.5" /> },
  { label: "Marketing Expenses", amount: 6980, detail: "Category description here...", icon: <Icons.Activity className="w-3.5 h-3.5" /> },
  { label: "Operational Costs", amount: 8750, detail: "Category description here...", icon: <Icons.PieChart className="w-3.5 h-3.5" /> }
];

const formatPercent = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "+0%";
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded)}%`;
};

interface MonthlySalesChartProps {
  total?: number;
  isLoading?: boolean;
}

export function MonthlySalesChart({ total, isLoading = false }: MonthlySalesChartProps) {
  const displayTotal = typeof total === "number" ? total : 12876;
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <MotionDiv
      ref={ref}
      variants={scaleFade}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.3 }}
      className="group bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-3 flex flex-col gap-2 h-full transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.div
            className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em]"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Monthly Sales
          </motion.div>
          <motion.div
            className="text-lg font-semibold text-[var(--text-primary)] font-display"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {isLoading ? (
              <span className="text-[var(--text-muted)]">Loading...</span>
            ) : (
              formatCurrency(displayTotal)
            )}
          </motion.div>
        </div>
        <motion.button
          className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icons.More className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="relative w-full h-[130px] lg:h-[180px]">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-[var(--text-faint)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-full border-t border-dashed border-[var(--border-subtle)]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
          ))}
        </div>
        <div className="absolute bottom-[-16px] w-full flex justify-between text-[8px] text-[var(--text-muted)]">
          {["2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((year, i) => (
            <motion.span
              key={year}
              initial={{ opacity: 0, y: 5 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
            >
              {year}
            </motion.span>
          ))}
        </div>

        <svg viewBox="0 0 1200 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Animated area fill */}
          <motion.path
            d="M0 250 C 150 200, 300 280, 450 150 S 700 50, 850 100 S 1100 200, 1200 150 V 300 H 0 Z"
            fill="url(#salesGradient)"
            stroke="none"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom" }}
          />

          {/* Animated line path */}
          <motion.path
            d="M0 250 C 150 200, 300 280, 450 150 S 700 50, 850 100 S 1100 200, 1200 150"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              pathLength: { delay: 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { delay: 0.3, duration: 0.3 }
            }}
          />

          {/* Animated glowing dot at the end */}
          <motion.circle
            cx="1200"
            cy="150"
            r="6"
            fill="#22d3ee"
            className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: [0, 1.2, 1], opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.4, ease: "easeOut" }}
          />
        </svg>
      </div>
    </MotionDiv>
  );
}

interface OutflowChartProps {
  items?: OutflowItem[];
  total?: number;
  changePercent?: number;
  isLoading?: boolean;
  title?: string;
}

export function OutflowChart({
  items,
  total,
  changePercent,
  isLoading = false,
  title = "Outflows"
}: OutflowChartProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Pie chart colors using theme colors
  const pieColors = [
    "#22d3ee", // Primary cyan
    "#a855f7", // Accent purple
    "#3b82f6", // Info blue
    "#22c55e", // Success green
    "#f59e0b"  // Warning amber
  ];

  const chartItems = items && items.length > 0 ? items : outflowData;
  const totalAmount = typeof total === "number"
    ? total
    : chartItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <MotionDiv
      ref={ref}
      variants={fadeUpVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.005 }}
      className="group bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-3 flex flex-col gap-3 h-full transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-purple)]"
    >
      <div className="flex items-center justify-between">
        <motion.div
          className="text-[13px] font-semibold text-[var(--text-primary)]"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {title}
        </motion.div>
        <motion.button
          className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icons.More className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <motion.div
        className="relative w-28 h-28 mx-auto flex-shrink-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {chartItems.map((item, index) => {
            const value = Math.max(item.amount || 0, 0);
            const dash = totalAmount > 0 ? (value / totalAmount) * circumference : 0;
            const strokeDasharray = `${dash} ${circumference}`;
            const currentOffset = offset;
            offset += dash;

            return (
              <motion.circle
                key={`${item.label}-${index}`}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={pieColors[index % pieColors.length]}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-currentOffset}
                className={index === 0 ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" : undefined}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={isInView ? { strokeDasharray } : {}}
                transition={{
                  delay: 0.5 + index * 0.15,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            );
          })}
        </svg>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {isLoading ? (
            <Loader size="sm" content="Loading" />
          ) : (
            <>
              <motion.span
                className="font-semibold text-base text-[var(--text-primary)] font-display"
                initial={{ opacity: 0, y: 5 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                {formatCurrency(totalAmount)}
              </motion.span>
              <motion.div
                className="bg-[var(--success-soft)] text-[var(--success)] text-[9px] font-medium px-1.5 py-0.5 rounded border border-[rgba(34,197,94,0.3)] mt-0.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.3, type: "spring", stiffness: 300 }}
              >
                {formatPercent(changePercent)}
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {chartItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex justify-between items-center group/item hover:bg-[var(--surface-hover)] rounded-md p-1.5 -mx-1.5 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-6 h-6 rounded-[6px] border flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  backgroundColor: `${pieColors[index]}15`,
                  borderColor: `${pieColors[index]}40`,
                  color: pieColors[index]
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {item.icon || <Icons.Activity className="w-3.5 h-3.5" />}
              </motion.div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-[var(--text-primary)] truncate">{item.label}</div>
                <div className="text-[9px] text-[var(--text-muted)] truncate">{item.detail || "Last 30 days"}</div>
              </div>
            </div>
            <motion.div
              className="text-[11px] font-semibold text-[var(--text-primary)] font-display flex-shrink-0 ml-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 + index * 0.08, duration: 0.3 }}
            >
              {formatCurrency(item.amount)}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="border-t border-[var(--border-subtle)] pt-2 flex justify-between items-center mt-auto flex-shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--success)] font-medium">{formatPercent(changePercent)}</span>
          <span className="text-[11px] text-[var(--text-muted)]">from last month</span>
        </div>
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Icons.Activity className="w-3 h-3 text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </MotionDiv>
  );
}
