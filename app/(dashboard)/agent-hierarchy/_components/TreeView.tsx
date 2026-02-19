import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Tag, Panel } from "rsuite";
import ArrowUpIcon from "@rsuite/icons/ArrowUp";
import ArrowDownIcon from "@rsuite/icons/ArrowDown";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import type { AgentWithHierarchy, AgentInfo } from "@/lib/api/agentHierarchy";

interface TreeViewProps {
  hierarchy: {
    agentNumber: string;
    totalAgentsFound: number;
    agents: AgentWithHierarchy[];
    summary: {
      uniqueUplineCount: number;
      uniqueDownlineCount: number;
    };
  };
}

export default function TreeView({ hierarchy }: TreeViewProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());

  const toggleExpand = (agentId: string) => {
    const next = new Set(expandedAgents);
    if (next.has(agentId)) next.delete(agentId);
    else next.add(agentId);
    setExpandedAgents(next);
  };

  const AgentCard = ({
    agent,
    level = 0,
    type = "current",
  }: {
    agent: AgentWithHierarchy | AgentInfo;
    level?: number;
    type?: "current" | "upline" | "downline";
  }) => {
    const isExpanded = expandedAgents.has(agent.userId);
    const agentWithHierarchy = agent as AgentWithHierarchy;
    const downlineList = agentWithHierarchy.hierarchy?.downline ?? [];
    const hasDownline = downlineList.length > 0;
    const uplineCount = agentWithHierarchy.hierarchy?.uplineCount ?? 0;
    const downlineCount = agentWithHierarchy.hierarchy?.downlineCount ?? downlineList.length;

    const typeStyles = {
      current: {
        bg: "bg-[var(--accent-soft)]",
        border: "border-[var(--border-purple)]",
        badge: "bg-[var(--accent)]",
        text: "text-[var(--accent)]",
      },
      upline: {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        border: "border-amber-200 dark:border-amber-800",
        badge: "bg-amber-600 dark:bg-amber-700",
        text: "text-amber-600 dark:text-amber-400",
      },
      downline: {
        bg: "bg-[var(--surface)]",
        border: "border-[var(--border)]",
        badge: "bg-slate-600 dark:bg-slate-700",
        text: "text-[var(--text-primary)]",
      },
    };

    const style = typeStyles[type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border-2 ${style.border} ${style.bg} overflow-hidden ${
          level > 0 ? "ml-6 mt-3" : ""
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${style.badge} text-white text-sm font-semibold`}
              >
                {agent.name ? agent.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${style.text} truncate text-base`}>
                  {agent.name || "—"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
                  {type === "current" && (
                    <Tag color="cyan" size="sm">
                      {uplineCount} upline · {downlineCount} downline
                    </Tag>
                  )}
                  {agent.agentCode && (
                    <span className="font-mono text-xs">{agent.agentCode}</span>
                  )}
                  {agent.agentNumber && (
                    <span className="font-mono text-xs">#{agent.agentNumber}</span>
                  )}
                  {agent.email && (
                    <span className="truncate text-xs">{agent.email}</span>
                  )}
                </div>
              </div>
            </div>
           
          </div>
        </div>

        <AnimatePresence>
          {hasDownline && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Downline ({downlineCount})
              </p>
              <div className="space-y-3">
                {agentWithHierarchy.hierarchy.downline.map((d) => (
                  <AgentCard key={d.userId} agent={d} level={level + 1} type="downline" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upline Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ArrowUpIcon className="text-amber-600" />
          <span className="font-semibold text-[var(--text-primary)]">
            Agents Above (Upline)
          </span>
        </div>
        {hierarchy.summary.uniqueUplineCount > 0 ? (
          <div className="space-y-3">
            {(() => {
              const seen = new Set<string>();
              const uplineList: AgentInfo[] = [];
              hierarchy.agents.forEach((agent: AgentWithHierarchy) => {
                const upline = agent.hierarchy?.upline;
                if (!upline) return;
                const inOrder = [upline.agent, upline.masterAgent].filter(Boolean);
                inOrder.forEach((u) => {
                  if (u?.userId && !seen.has(u.userId)) {
                    seen.add(u.userId);
                    uplineList.push(u);
                  }
                });
              });
              return uplineList.map((u) => (
                <AgentCard key={u.userId} agent={u} type="upline" />
              ));
            })()}
          </div>
        ) : (
          <div className="group relative rounded-[12px] border-2 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 shadow-[var(--shadow-card)] py-8 text-center transition-colors duration-300 hover:border-amber-300 hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden">
            <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent pointer-events-none dark:from-amber-900/20" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
            <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.1), transparent)", transform: "skewX(-20deg)" }} />
            <div className="relative z-10">
              <ArrowUpIcon className="mx-auto h-10 w-10 text-amber-500" />
              <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-400">
                No agents above
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Current Agent Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <UserInfoIcon className="text-[var(--accent)]" />
          <span className="font-semibold text-[var(--text-primary)]">
            Current Agent(s) — #{hierarchy.agentNumber}
          </span>
        </div>
        <div className="space-y-3">
          {hierarchy.agents.map((agent: AgentWithHierarchy) => (
            <AgentCard key={agent.userId} agent={agent} type="current" />
          ))}
        </div>
      </div>

      {/* Downline Section */}
      {(() => {
        const allDownlines = hierarchy.agents.flatMap(
          (a: AgentWithHierarchy) => a.hierarchy?.downline ?? []
        );
        const seenIds = new Set<string>();
        const uniqueDownline = allDownlines.filter(
          (d: AgentInfo) => d?.userId && !seenIds.has(d.userId) && seenIds.add(d.userId)
        );
        return uniqueDownline.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ArrowDownIcon className="text-slate-600" />
              <span className="font-semibold text-[var(--text-primary)]">Downline</span>
            </div>
            <div className="space-y-3">
              {uniqueDownline.map((d: AgentInfo) => (
                <AgentCard key={d.userId} agent={d} type="downline" />
              ))}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}
