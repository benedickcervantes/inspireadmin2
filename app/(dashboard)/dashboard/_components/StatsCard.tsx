"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { fadeUpVariant, smoothSpring, MotionDiv } from "./motion";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Chart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  TrendUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
};

interface StatsCardProps {
  title: string;
  amount: string;
  percentage: string;
  trendAmount: string;
  trendText: string;
  icon?: React.ReactNode;
  index?: number;
  onClick?: () => void;
}

export default function StatsCard({ title, amount, percentage, trendAmount, trendText, icon, index = 0, onClick }: StatsCardProps) {
  const isPositive = !percentage.trim().startsWith("-");

  // Mouse parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionDiv
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.02,
        transition: smoothSpring
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-3 flex items-center justify-between gap-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
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

      <div className="min-w-0 relative z-10" style={{ transform: "translateZ(20px)" }}>
        <motion.div
          className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-[0.08em]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
        >
          {title}
        </motion.div>
        <div className="flex items-center gap-2 mt-1">
          <motion.div
            className="text-lg font-semibold text-[var(--text-primary)] font-display"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {amount}
          </motion.div>
          <motion.span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
              isPositive
                ? "bg-[var(--success-soft)] border-[rgba(34,197,94,0.3)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] border-[rgba(239,68,68,0.3)] text-[var(--danger)]"
            }`}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.span
              initial={{ rotate: isPositive ? -45 : 45 }}
              animate={{ rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
            >
              {isPositive ? (
                <Icons.TrendUp className="w-2.5 h-2.5" />
              ) : (
                <Icons.TrendDown className="w-2.5 h-2.5" />
              )}
            </motion.span>
            {percentage}
          </motion.span>
        </div>
        <motion.div
          className="text-[11px] text-[var(--text-muted)] mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
        >
          <span className="font-semibold text-[var(--primary)]">{trendAmount}</span> {trendText}
        </motion.div>
      </div>

      <motion.div
        className="w-9 h-9 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary-soft)] group-hover:border-[var(--border-accent)] transition-all duration-300 relative z-10"
        style={{ transform: "translateZ(30px)" }}
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        {icon || <Icons.Chart className="w-4 h-4" />}
      </motion.div>
    </MotionDiv>
  );
}
