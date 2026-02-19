// API functions for agent hierarchy

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";

export interface AgentInfo {
  userId: string;
  name: string;
  email: string;
  agentNumber: string;
  agentCode: string;
  accountNumber?: string;
}

export interface AgentUpline {
  masterAgent: AgentInfo | null;
  agent: AgentInfo | null;
}

export interface AgentWithHierarchy extends AgentInfo {
  hierarchy: {
    upline: AgentUpline | null;
    downline: AgentInfo[];
    uplineCount: number;
    downlineCount: number;
  };
}

export interface AgentHierarchyData {
  agentNumber: string;
  totalAgentsFound: number;
  agents: AgentWithHierarchy[];
  summary: {
    uniqueUplineCount: number;
    uniqueDownlineCount: number;
  };
}

export interface AgentHierarchyResponse {
  success: boolean;
  data: AgentHierarchyData;
  error?: string;
}

/**
 * Get agent hierarchy by agent number
 */
export async function getAgentHierarchyByNumber(
  agentNumber: string
): Promise<AgentHierarchyResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(
    `${API_BASE_URL}/api/agent-hierarchy/number/${encodeURIComponent(agentNumber)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch agent hierarchy");
  }

  return await response.json();
}
