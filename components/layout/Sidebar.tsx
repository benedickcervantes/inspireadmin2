"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Dropdown, Nav, Sidenav } from "rsuite";
import DashboardIcon from "@rsuite/icons/Dashboard";
import TaskIcon from "@rsuite/icons/Task";
import DetailIcon from "@rsuite/icons/Detail";
import MemberIcon from "@rsuite/icons/Member";
import GlobalIcon from "@rsuite/icons/Global";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import SendIcon from "@rsuite/icons/Send";
import PieChartIcon from "@rsuite/icons/PieChart";
import GearIcon from "@rsuite/icons/Gear";
import HistoryIcon from "@rsuite/icons/History";
import { useTheme } from "@/contexts/ThemeContext";

type UserDisplay = {
  label: string;
  secondary?: string;
  initials: string;
};

type SidebarProps = {
  expanded: boolean;
  onToggle?: () => void;
  user?: UserDisplay;
  onLogout?: () => void;
  onNavigate?: () => void;
};

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  RailToggle: ({ expanded, ...props }: IconProps & { expanded: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {expanded ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  ),
  Logout: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Sun: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  MessageCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Network: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M12 8v8" />
      <path d="M12 16h7" />
      <path d="M12 16H5" />
    </svg>
  )
};

const menuKeyByPath: Record<string, string> = {
  "/crypto-deposits": "deposits",
  "/deposit-request": "deposits",
  "/withdrawal-request": "withdrawals",
  "/maya": "services",
  "/bank-services": "services",
  "/agent-hierarchy": "agents",
  "/agent-request": "agents",
  "/tasks": "tasks",
  "/task-management": "tasks",
  "/task-withdrawal": "tasks"
};

// Animation variants
const sidebarVariants = {
  expanded: {
    width: "auto",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  collapsed: {
    width: "auto",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

const brandTextVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "flex",
    transition: {
      duration: 0.25,
      delay: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transitionEnd: {
      display: "none"
    },
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

const userInfoVariants = {
  expanded: {
    opacity: 1,
    width: "auto",
    marginLeft: 8,
    transition: {
      duration: 0.25,
      delay: 0.05,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  collapsed: {
    opacity: 0,
    width: 0,
    marginLeft: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

const themeLabelVariants = {
  expanded: {
    opacity: 1,
    width: "auto",
    transition: {
      duration: 0.2,
      delay: 0.1
    }
  },
  collapsed: {
    opacity: 0,
    width: 0,
    transition: {
      duration: 0.1
    }
  }
};

export default function Sidebar({ expanded, onToggle, user, onLogout, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const activeMenuKey = useMemo(() => menuKeyByPath[pathname], [pathname]);

  useEffect(() => {
    if (!activeMenuKey) {
      return;
    }

    setOpenKeys((prev) => (prev.includes(activeMenuKey) ? prev : [...prev, activeMenuKey]));
  }, [activeMenuKey]);

  useEffect(() => {
    // Disable initial mount animations after first render
    const timer = setTimeout(() => setIsInitialMount(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.aside
      className={`app-rail ${expanded ? "app-rail--expanded" : "app-rail--collapsed"}`}
      initial={isInitialMount ? { x: -20, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Brand Section */}
      <motion.div
        className={`rail-brand ${expanded ? "rail-brand--expanded" : ""}`}
        initial={isInitialMount ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          className="rail-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Image
            src="/inspire.png"
            alt="Inspire Logo"
            width={expanded ? 80 : 40}
            height={expanded ? 80 : 40}
            className="object-contain"
            priority
            unoptimized
          />
        </motion.div>
        
        {/* Brand Text - Company Name */}
        <AnimatePresence mode="wait">
          {expanded && (
            <motion.div
              className="rail-brand-text"
              variants={brandTextVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <motion.span
                className="rail-title"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                INSPIRE ALLIANCE
              </motion.span>
              <motion.span
                className="rail-subtitle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                FUND GROUP INC.
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="rail-divider"
        initial={isInitialMount ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />

      {/* Navigation */}
      <motion.div
        initial={isInitialMount ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`flex-1 min-h-0 ${expanded ? "overflow-y-auto overflow-x-hidden" : "overflow-visible"}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(139, 148, 158, 0.2) transparent'
        }}
      >
        <Sidenav
          appearance="subtle"
          expanded={expanded}
          openKeys={openKeys}
          onOpenChange={(nextKeys) => setOpenKeys(nextKeys as string[])}
          className={`app-sidenav app-sidenav-dark ${expanded ? "app-sidenav-expanded" : "app-sidenav-compact"}`}
        >
          <Sidenav.Body>
            <Nav activeKey={pathname}>
              <Nav.Item eventKey="/dashboard" as={Link} href="/dashboard" icon={<DashboardIcon />} title="Dashboard" onClick={onNavigate}>
                Dashboard
              </Nav.Item>
              <Nav.Item eventKey="/users" as={Link} href="/users" icon={<MemberIcon />} title="Users" onClick={onNavigate}>
                Users
              </Nav.Item>
              <Nav.Menu eventKey="deposits" title="Deposits" icon={<CreditCardPlusIcon />}>
                <Nav.Item eventKey="/crypto-deposits" as={Link} href="/crypto-deposits" onClick={onNavigate}>Crypto Deposits</Nav.Item>
                <Nav.Item eventKey="/deposit-request" as={Link} href="/deposit-request" onClick={onNavigate}>Deposit Request</Nav.Item>
              </Nav.Menu>
              <Nav.Menu eventKey="withdrawals" title="Withdrawals" icon={<SendIcon />}>
                <Nav.Item eventKey="/withdrawal-request" as={Link} href="/withdrawal-request" onClick={onNavigate}>Withdrawal Request</Nav.Item>
              </Nav.Menu>
              <Nav.Menu eventKey="services" title="Services" icon={<GlobalIcon />}>
                <Nav.Item eventKey="/maya" as={Link} href="/maya" onClick={onNavigate}>Maya</Nav.Item>
                <Nav.Item eventKey="/bank-services" as={Link} href="/bank-services" onClick={onNavigate}>Bank Services</Nav.Item>
              </Nav.Menu>
              <Nav.Item eventKey="/kyc-requests" as={Link} href="/kyc-requests" icon={<DetailIcon />} title="KYC Requests" onClick={onNavigate}>
                KYC Requests
              </Nav.Item>
              <Nav.Item 
                eventKey="/travel-protection" 
                as={Link} 
                href="/travel-protection" 
                icon={<Icons.Shield className="rs-icon" style={{ width: '1em', height: '1em' }} />} 
                title="Travel Protection" 
                onClick={onNavigate}
              >
                Travel Protection
              </Nav.Item>
              <Nav.Item 
                eventKey="/ticketing-support" 
                as={Link} 
                href="/ticketing-support" 
                icon={<Icons.MessageCircle className="rs-icon" style={{ width: '1em', height: '1em' }} />} 
                title="Ticketing Support" 
                onClick={onNavigate}
              >
                Ticketing Support
              </Nav.Item>
              <Nav.Menu eventKey="agents" title="Agent Management" icon={<Icons.Network className="rs-icon" style={{ width: '1em', height: '1em' }} />}>
                <Nav.Item eventKey="/agent-hierarchy" as={Link} href="/agent-hierarchy" onClick={onNavigate}>Agent Hierarchy</Nav.Item>
                <Nav.Item eventKey="/agent-request" as={Link} href="/agent-request" onClick={onNavigate}>Agent Request</Nav.Item>
              </Nav.Menu>
              <Nav.Menu eventKey="tasks" title="Tasks" icon={<TaskIcon />}>
                <Nav.Item eventKey="/task-management" as={Link} href="/task-management" onClick={onNavigate}>Task Management</Nav.Item>
                <Nav.Item eventKey="/task-withdrawal" as={Link} href="/task-withdrawal" onClick={onNavigate}>Task Withdrawal</Nav.Item>
              </Nav.Menu>
              <Nav.Item eventKey="/admin-history" as={Link} href="/admin-history" icon={<HistoryIcon />} title="Admin History" onClick={onNavigate}>
                Admin History
              </Nav.Item>
              <Nav.Item eventKey="/reports" as={Link} href="/reports" icon={<PieChartIcon />} title="System Reports" onClick={onNavigate}>
                System Reports
              </Nav.Item>
              <Nav.Item eventKey="/settings" as={Link} href="/settings" icon={<GearIcon />} title="Settings" onClick={onNavigate}>
                Settings
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div
        className={`rail-theme-toggle ${expanded ? "rail-theme-toggle--expanded" : ""}`}
        initial={isInitialMount ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="theme-toggle-track"
            animate={{
              backgroundColor: theme === "dark" ? "rgba(34, 211, 238, 0.15)" : "rgba(251, 191, 36, 0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`theme-toggle-thumb ${theme === "light" ? "theme-toggle-thumb--light" : ""}`}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icons.Moon className="w-3 h-3" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icons.Sun className="w-3 h-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="theme-toggle-icons">
              <motion.div
                animate={{ opacity: theme === "dark" ? 1 : 0.3 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Moon className="w-3 h-3 theme-icon-moon" />
              </motion.div>
              <motion.div
                animate={{ opacity: theme === "light" ? 1 : 0.3 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Sun className="w-3 h-3 theme-icon-sun" />
              </motion.div>
            </div>
          </motion.div>
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.span
                className="theme-toggle-label"
                variants={themeLabelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="rail-footer"
        initial={isInitialMount ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {user ? (
          <Dropdown
            placement={expanded ? "topStart" : "rightEnd"}
            renderToggle={(props, ref) => (
              <motion.button
                {...props}
                ref={ref}
                type="button"
                className={`rail-user-toggle ${expanded ? "rail-user-toggle--expanded" : ""}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Avatar circle size="sm" className="!bg-gradient-to-br !from-[var(--primary)] !to-[var(--accent)] !text-[var(--background)] font-semibold text-[11px]">
                    {user.initials}
                  </Avatar>
                </motion.div>
                <AnimatePresence mode="wait">
                  {expanded && (
                    <motion.div
                      className="rail-user-info"
                      variants={userInfoVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      <motion.span
                        className="rail-user-name"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                      >
                        {user.label}
                      </motion.span>
                      {user.secondary && (
                        <motion.span
                          className="rail-user-email"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15, duration: 0.2 }}
                        >
                          {user.secondary}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          >
            <Dropdown.Item className="rail-logout-item" onClick={onLogout}>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Logout className="w-4 h-4" />
                <span>Logout</span>
              </motion.div>
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Avatar circle size="sm" className="!bg-[var(--surface-elevated)] !text-[var(--text-muted)] font-medium text-xs">
              ?
            </Avatar>
          </motion.div>
        )}
        {onToggle && (
          <motion.button
            type="button"
            className="rail-toggle"
            onClick={onToggle}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            whileHover={{ scale: 1.1, backgroundColor: "var(--surface-hover)" }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icons.RailToggle expanded={expanded} className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </motion.aside>
  );
}
