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
  { label: "Deposits", amount: 9450, detail: "Last 30 days", icon: <Icons.Wallet className="w-3.5 h-3.5" /> },
  { label: "Withdrawals", amount: 8600, detail: "Last 30 days", icon: <Icons.Users className="w-3.5 h-3.5" /> },
  { label: "Investments", amount: 3120, detail: "Last 30 days", icon: <Icons.Box className="w-3.5 h-3.5" /> },
  { label: "Dividends", amount: 6980, detail: "Last 30 days", icon: <Icons.Activity className="w-3.5 h-3.5" /> },
  { label: "Other", amount: 8750, detail: "Last 30 days", icon: <Icons.PieChart className="w-3.5 h-3.5" /> }
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [visibleLines, setVisibleLines] = React.useState<Set<string>>(new Set(['timeDeposits', 'availBalance', 'wallet', 'agentWallet', 'stock']));
  const [timeScale, setTimeScale] = React.useState<'year' | 'month' | 'week' | 'day'>('year');
  const [showTimeMenu, setShowTimeMenu] = React.useState(false);
  const displayTotal = typeof total === "number" ? total : 12876;
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showTimeMenu) {
        setShowTimeMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTimeMenu]);

  const toggleLine = (lineId: string) => {
    setVisibleLines(prev => {
      // If this line is the only one visible, show all lines
      if (prev.size === 1 && prev.has(lineId)) {
        return new Set(['timeDeposits', 'availBalance', 'wallet', 'agentWallet', 'stock']);
      }
      // Otherwise, show only this line
      return new Set([lineId]);
    });
  };

  const getTimeLabels = () => {
    switch (timeScale) {
      case 'year':
        return ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
      case 'month':
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      case 'week':
        return ["Week 1", "Week 2", "Week 3", "Week 4"];
      case 'day':
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      default:
        return ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    }
  };

  const timeLabels = getTimeLabels();

  const lines = [
    { id: 'timeDeposits', color: '#22d3ee', label: 'Time Deposits', path: 'M0 250 C 150 200, 300 280, 450 150 S 700 50, 850 100 S 1100 200, 1200 150', endY: 150 },
    { id: 'availBalance', color: '#a855f7', label: 'Avail Balance', path: 'M0 220 C 150 180, 300 250, 450 130 S 700 70, 850 120 S 1100 180, 1200 130', endY: 130 },
    { id: 'wallet', color: '#22c55e', label: 'Total Wallet', path: 'M0 270 C 150 240, 300 260, 450 180 S 700 90, 850 140 S 1100 220, 1200 170', endY: 170 },
    { id: 'agentWallet', color: '#f59e0b', label: 'Agent Wallet', path: 'M0 240 C 150 210, 300 270, 450 160 S 700 80, 850 130 S 1100 190, 1200 140', endY: 140 },
    { id: 'stock', color: '#3b82f6', label: 'Stock Amount', path: 'M0 260 C 150 230, 300 240, 450 170 S 700 100, 850 150 S 1100 210, 1200 160', endY: 160 }
  ];

  return (
    <>
      {/* Backdrop overlay when expanded - render first */}
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
        initial="hidden"
        animate={
          isExpanded
            ? {
                opacity: 1,
                scale: 1,
                rotateY: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }
            : isInView
            ? "visible"
            : "hidden"
        }
        variants={scaleFade}
        whileHover={{ scale: isExpanded ? 1 : 1.005 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`group bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-3 flex flex-col gap-2 h-full transition-all duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] cursor-pointer ${
          isExpanded ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-6xl z-[9999] !h-auto max-h-[85vh] overflow-auto shadow-2xl' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
      <div className="flex items-center justify-between">
        <div>
          <motion.div
            className={`uppercase tracking-[0.08em] ${isExpanded ? 'text-sm' : 'text-[11px]'} text-[var(--text-muted)] transition-all duration-300`}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            IWALLET GRAPHS {isExpanded && '(Click to minimize)'}
          </motion.div>
          <motion.div
            className={`font-semibold text-[var(--text-primary)] font-display transition-all duration-300 ${isExpanded ? 'text-3xl' : 'text-lg'}`}
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
        <div className="relative">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowTimeMenu(!showTimeMenu);
            }}
            className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.More className="w-3.5 h-3.5" />
          </motion.button>

          {/* Dropdown Menu */}
          {showTimeMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-32 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-lg)] overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { value: 'year' as const, label: 'Year' },
                { value: 'month' as const, label: 'Month' },
                { value: 'week' as const, label: 'Week' },
                { value: 'day' as const, label: 'Day' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeScale(option.value);
                    setShowTimeMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                    timeScale === option.value
                      ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className={`relative w-full ${isExpanded ? 'h-[500px]' : 'h-[130px] lg:h-[180px]'} transition-all duration-300`}>
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
        <div className={`absolute bottom-[-16px] w-full flex justify-between text-[var(--text-muted)] transition-all duration-300 ${isExpanded ? 'text-xs' : 'text-[8px]'}`}>
          {timeLabels.map((label, i) => (
            <motion.span
              key={`${label}-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
            >
              {label}
            </motion.span>
          ))}
        </div>

        <svg viewBox="0 0 1200 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            {lines.map(line => (
              <linearGradient key={`${line.id}Gradient`} id={`${line.id}Gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={line.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={line.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {lines.map((line, index) => {
            const isVisible = visibleLines.has(line.id);
            return (
              <React.Fragment key={line.id}>
                {/* Area fill */}
                <motion.path
                  d={`${line.path} V 300 H 0 Z`}
                  fill={`url(#${line.id}Gradient)`}
                  stroke="none"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0, 
                    scaleY: isVisible ? 1 : 0 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  style={{ transformOrigin: "bottom" }}
                />
                {/* Line path */}
                <motion.path
                  d={line.path}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={`drop-shadow-[0_0_8px_${line.color}80]`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isVisible ? 1 : 0, 
                    opacity: isVisible ? 1 : 0 
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                />
                {/* End dot */}
                <motion.circle 
                  cx="1200" 
                  cy={line.endY} 
                  r="5" 
                  fill={line.color} 
                  className={`drop-shadow-[0_0_10px_${line.color}CC]`}
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ 
                    scale: isVisible ? 1 : 0, 
                    opacity: isVisible ? 1 : 0 
                  }} 
                  transition={{ duration: 0.3, ease: "easeOut" }} 
                />
              </React.Fragment>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <motion.div
        className={`flex flex-wrap gap-3 mt-3 ${isExpanded ? 'justify-center' : 'justify-start'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.3, duration: 0.4 }}
      >
        {lines.map((line, index) => {
          const isVisible = visibleLines.has(line.id);
          return (
            <motion.button
              key={line.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleLine(line.id);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
                isVisible 
                  ? 'bg-[var(--surface-soft)] hover:bg-[var(--surface-hover)] border border-[var(--border)]' 
                  : 'bg-transparent hover:bg-[var(--surface-soft)] border border-transparent opacity-40'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.3 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  backgroundColor: line.color, 
                  boxShadow: isVisible ? `0 0 6px ${line.color}80` : 'none'
                }}
                animate={{
                  scale: isVisible ? 1 : 0.7,
                  opacity: isVisible ? 1 : 0.5
                }}
                transition={{ duration: 0.2 }}
              />
              <span 
                className={`transition-all duration-300 ${isExpanded ? 'text-xs' : 'text-[9px]'} ${
                  isVisible ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {line.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </MotionDiv>
    </>
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Bar chart colors using theme colors
  const barColors = [
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

  return (
    <>
      {/* Backdrop overlay when expanded - render first */}
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
        initial="hidden"
        animate={
          isExpanded
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateY: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }
            : isInView
            ? "visible"
            : "hidden"
        }
        variants={fadeUpVariant}
        whileHover={{ scale: isExpanded ? 1 : 1.005 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`group bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-3 flex flex-col gap-3 h-full transition-all duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-purple)] cursor-pointer ${
          isExpanded ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-3xl z-[9999] !h-auto max-h-[85vh] overflow-auto shadow-2xl' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
      <div className="flex items-center justify-between">
        <motion.div
          className={`font-semibold text-[var(--text-primary)] transition-all duration-300 ${isExpanded ? 'text-xl' : 'text-[13px]'}`}
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {title} {isExpanded && '(Click to minimize)'}
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

      {/* Total Amount Display */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div>
          <motion.span
            className={`font-semibold text-[var(--text-primary)] font-display transition-all duration-300 ${isExpanded ? 'text-6xl' : 'text-4xl'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {isLoading ? "Loading..." : formatCurrency(totalAmount)}
          </motion.span>
        </div>
        <motion.div
          className={`bg-[var(--success-soft)] text-[var(--success)] font-medium px-2 py-1 rounded border border-[rgba(34,197,94,0.3)] transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-[10px]'}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 300 }}
        >
          {formatPercent(changePercent)}
        </motion.div>
      </motion.div>

      {/* Horizontal Stacked Bar Chart */}
      <motion.div
        className={`relative w-full flex rounded-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'h-4' : 'h-2'}`}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      >
        {chartItems.map((item, index) => {
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
          return (
            <motion.div
              key={`${item.label}-${index}`}
              className="relative group/bar"
              style={{
                width: `${percentage}%`,
                backgroundColor: barColors[index % barColors.length],
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${percentage}%` } : {}}
              transition={{
                delay: 0.6 + index * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                filter: 'brightness(1.2)',
                transition: { duration: 0.2 }
              }}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg px-2 py-1 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                <div className="text-[10px] font-semibold text-[var(--text-primary)]">{item.label}</div>
                <div className="text-[9px] text-[var(--text-muted)]">{percentage.toFixed(1)}%</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Legend Items */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {chartItems.map((item, index) => {
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
          return (
            <motion.div
              key={index}
              className={`flex justify-between items-center group/item hover:bg-[var(--surface-hover)] rounded-md transition-colors cursor-pointer ${isExpanded ? 'p-3 -mx-3' : 'p-1.5 -mx-1.5'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className={`rounded-[6px] border flex items-center justify-center flex-shrink-0 transition-all ${isExpanded ? 'w-10 h-10' : 'w-6 h-6'}`}
                  style={{
                    backgroundColor: `${barColors[index]}15`,
                    borderColor: `${barColors[index]}40`,
                    color: barColors[index]
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {item.icon || <Icons.Activity className={`${isExpanded ? 'w-5 h-5' : 'w-3.5 h-3.5'}`} />}
                </motion.div>
                <div className="min-w-0">
                  <div className={`font-semibold text-[var(--text-primary)] truncate transition-all duration-300 ${isExpanded ? 'text-base' : 'text-[11px]'}`}>{item.label}</div>
                  <div className={`text-[var(--text-muted)] truncate transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-[9px]'}`}>{percentage.toFixed(1)}% • {item.detail || "Last 30 days"}</div>
                </div>
              </div>
              <motion.div
                className={`font-semibold text-[var(--text-primary)] font-display flex-shrink-0 ml-2 transition-all duration-300 ${isExpanded ? 'text-lg' : 'text-[11px]'}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + index * 0.08, duration: 0.3 }}
              >
                {formatCurrency(item.amount)}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className={`border-t border-[var(--border-subtle)] pt-2 flex justify-between items-center mt-auto flex-shrink-0 ${isExpanded ? 'pt-4' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <span className={`text-[var(--success)] font-medium transition-all duration-300 ${isExpanded ? 'text-base' : 'text-[11px]'}`}>{formatPercent(changePercent)}</span>
          <span className={`text-[var(--text-muted)] transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-[11px]'}`}>from last month</span>
        </div>
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Icons.Activity className="w-3 h-3 text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </MotionDiv>
    </>
  );
}
