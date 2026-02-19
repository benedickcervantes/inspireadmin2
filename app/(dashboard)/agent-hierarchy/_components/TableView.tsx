import { useState, useMemo } from "react";
import { Input, InputGroup, SelectPicker, Table, Tag, Pagination } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";
import type { AgentWithHierarchy, AgentInfo } from "@/lib/api/agentHierarchy";

const { Column, HeaderCell, Cell } = Table;

interface TableViewProps {
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

export default function TableView({ hierarchy }: TableViewProps) {
  const [tableSearch, setTableSearch] = useState("");
  const [tableFilter, setTableFilter] = useState<"all" | "upline" | "downline">("all");
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit] = useState(10);

  // Prepare table data
  const tableData = useMemo(() => {
    const allAgents: Array<AgentInfo & { type: "upline" | "downline" | "current" }> = [];

    // Add current agents
    hierarchy.agents.forEach((agent: AgentWithHierarchy) => {
      allAgents.push({ ...agent, type: "current" });
    });

    // Add upline agents
    const seenUpline = new Set<string>();
    hierarchy.agents.forEach((agent: AgentWithHierarchy) => {
      const upline = agent.hierarchy?.upline;
      if (!upline) return;
      const inOrder = [upline.agent, upline.masterAgent].filter(Boolean);
      inOrder.forEach((u) => {
        if (u?.userId && !seenUpline.has(u.userId)) {
          seenUpline.add(u.userId);
          allAgents.push({ ...u, type: "upline" });
        }
      });
    });

    // Add downline agents
    const seenDownline = new Set<string>();
    hierarchy.agents.forEach((agent: AgentWithHierarchy) => {
      const downline = agent.hierarchy?.downline ?? [];
      downline.forEach((d: AgentInfo) => {
        if (d?.userId && !seenDownline.has(d.userId)) {
          seenDownline.add(d.userId);
          allAgents.push({ ...d, type: "downline" });
        }
      });
    });

    return allAgents;
  }, [hierarchy]);

  // Filter and search table data
  const filteredTableData = useMemo(() => {
    let filtered = tableData;

    // Apply type filter
    if (tableFilter !== "all") {
      filtered = filtered.filter((agent) => agent.type === tableFilter);
    }

    // Apply search
    if (tableSearch.trim()) {
      const search = tableSearch.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name?.toLowerCase().includes(search) ||
          agent.email?.toLowerCase().includes(search) ||
          agent.agentNumber?.toLowerCase().includes(search) ||
          agent.agentCode?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tableData, tableFilter, tableSearch]);

  // Paginate table data
  const paginatedTableData = useMemo(() => {
    const start = (tablePage - 1) * tableLimit;
    const end = start + tableLimit;
    return filteredTableData.slice(start, end);
  }, [filteredTableData, tablePage, tableLimit]);

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="flex-1 max-w-md">
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
          <Input
            placeholder="Search by name, email, agent number..."
            value={tableSearch}
            onChange={setTableSearch}
          />
          {tableSearch && (
            <InputGroup.Button onClick={() => setTableSearch("")}>
              <CloseIcon />
            </InputGroup.Button>
          )}
        </InputGroup>
        <SelectPicker
          data={[
            { label: "All Agents", value: "all" },
            { label: "Upline Only", value: "upline" },
            { label: "Downline Only", value: "downline" },
          ]}
          value={tableFilter}
          onChange={(value) => {
            setTableFilter(value as "all" | "upline" | "downline");
            setTablePage(1);
          }}
          cleanable={false}
          searchable={false}
          className="w-full sm:w-48"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-[var(--text-muted)]">
        Showing {paginatedTableData.length} of {filteredTableData.length} agents
      </div>

      {/* Table */}
      <Table
        data={paginatedTableData}
        autoHeight
        bordered
        cellBordered
        hover
        className="rounded-lg overflow-hidden"
      >
        <Column width={60} align="center">
          <HeaderCell>Type</HeaderCell>
          <Cell>
            {(rowData: any) => {
              const colors = {
                current: "violet",
                upline: "orange",
                downline: "cyan",
              };
              return (
                <Tag color={colors[rowData.type as keyof typeof colors]} size="sm">
                  {rowData.type === "current" ? "Current" : rowData.type === "upline" ? "Up" : "Down"}
                </Tag>
              );
            }}
          </Cell>
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={120}>
          <HeaderCell>Agent #</HeaderCell>
          <Cell>
            {(rowData: any) => (
              <span className="font-mono text-xs">{rowData.agentNumber || "—"}</span>
            )}
          </Cell>
        </Column>

        <Column width={180}>
          <HeaderCell>Agent Code</HeaderCell>
          <Cell>
            {(rowData: any) => (
              <span className="font-mono text-xs">{rowData.agentCode || "—"}</span>
            )}
          </Cell>
        </Column>
      </Table>

      {/* Pagination */}
      {filteredTableData.length > tableLimit && (
        <div className="flex justify-center mt-4">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="md"
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            total={filteredTableData.length}
            limitOptions={[10, 20, 50]}
            limit={tableLimit}
            activePage={tablePage}
            onChangePage={setTablePage}
          />
        </div>
      )}
    </div>
  );
}
