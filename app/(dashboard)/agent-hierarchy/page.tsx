"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input, InputGroup, Button, Loader, Message, Panel, Nav } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import PeoplesIcon from "@rsuite/icons/Peoples";
import CloseIcon from "@rsuite/icons/Close";
import TreeIcon from "@rsuite/icons/Tree";
import TableIcon from "@rsuite/icons/Table";
import ArrowUpIcon from "@rsuite/icons/ArrowUp";
import ArrowDownIcon from "@rsuite/icons/ArrowDown";
import { getAgentHierarchyByNumber } from "@/lib/api/agentHierarchy";
import TreeView from "./_components/TreeView";
import TableView from "./_components/TableView";

export default function AgentHierarchyPage() {
  const [agentNumber, setAgentNumber] = useState("");
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"tree" | "table">("tree");

  const fetchHierarchy = async () => {
    const searched = agentNumber.trim();
    if (!searched) {
      setError("Please enter an agent number.");
      return;
    }

    setLoading(true);
    setError(null);
    setHierarchy(null);

    try {
      const result = await getAgentHierarchyByNumber(searched);

      if (result.success) {
        setHierarchy(result.data);
      } else {
        setError(result.error || "Failed to load hierarchy.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching hierarchy.");
      console.error("Error fetching hierarchy:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchHierarchy();
  };

  const clearSearch = () => {
    setAgentNumber("");
    setHierarchy(null);
    setError(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agent Hierarchy</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Search by agent number to view upline and downline structure
        </p>
      </motion.div>

      {/* Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Panel
          bordered
          className="bg-[var(--surface)] shadow-sm"
          header={
            <div className="flex items-center gap-2">
              <SearchIcon className="text-[var(--text-muted)]" />
              <span className="font-medium">Search Agent</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="flex-1">
              <InputGroup.Addon>
                <SearchIcon />
              </InputGroup.Addon>
              <Input
                placeholder="Enter agent number (e.g. 12345)"
                value={agentNumber}
                onChange={setAgentNumber}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              {agentNumber && (
                <InputGroup.Button onClick={clearSearch}>
                  <CloseIcon />
                </InputGroup.Button>
              )}
            </InputGroup>
            <Button
              appearance="primary"
              color="blue"
              onClick={fetchHierarchy}
              disabled={loading || !agentNumber.trim()}
              loading={loading}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Press Enter to search
          </p>
        </Panel>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Message showIcon type="error" header="Error">
              {error}
            </Message>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Loader size="lg" content="Loading hierarchy..." />
        </motion.div>
      )}

      {/* Results */}
      {hierarchy && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Summary Stats */}
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <motion.div
              className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                    <PeoplesIcon className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">
                  Total Agents
                </div>
                <motion.div
                  className="text-xl font-bold text-[var(--text-primary)] mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                >
                  {hierarchy.totalAgentsFound.toLocaleString()}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                    <ArrowUpIcon className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">
                  Upline
                </div>
                <motion.div
                  className="text-xl font-bold text-[var(--text-primary)] mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                >
                  {hierarchy.summary.uniqueUplineCount.toLocaleString()}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center">
                    <ArrowDownIcon className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">
                  Downline
                </div>
                <motion.div
                  className="text-xl font-bold text-[var(--text-primary)] mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                >
                  {hierarchy.summary.uniqueDownlineCount.toLocaleString()}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                    <SearchIcon className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">
                  Agent Number
                </div>
                <motion.div
                  className="text-xl font-bold text-[var(--text-primary)] mt-1 font-mono"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                >
                  {hierarchy.agentNumber}
                </motion.div>
              </div>
            </motion.div>
          </div>
          {/* Tab Navigation */}
          <Panel bordered className="bg-[var(--surface)] shadow-sm">
            <Nav
              appearance="subtle"
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key as "tree" | "table")}
              className="mb-4"
            >
              <Nav.Item eventKey="tree" icon={<TreeIcon />}>
                Tree View
              </Nav.Item>
              <Nav.Item eventKey="table" icon={<TableIcon />}>
                Table View
              </Nav.Item>
            </Nav>

            {/* Tree View */}
            {activeTab === "tree" && <TreeView hierarchy={hierarchy} />}

            {/* Table View */}
            {activeTab === "table" && <TableView hierarchy={hierarchy} />}
          </Panel>
        </motion.div>
      )}

      {/* Empty State */}
      {!hierarchy && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Panel bordered className="bg-[var(--surface)] shadow-sm">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] border-2 border-[var(--border-purple)] flex items-center justify-center mb-4">
                <PeoplesIcon className="text-[var(--accent)]" style={{ fontSize: "2.5rem" }} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                View Agent Hierarchy
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-muted)]">
                Enter an agent number above and click Search to see their upline and downline
              </p>
            </div>
          </Panel>
        </motion.div>
      )}
    </div>
  );
}
