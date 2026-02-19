// API functions for ticketing support

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";

export interface TicketMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  isCustomer: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "pending" | "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  requestType: string;
  notes: string;
  resolution: string;
  resolvedAt: string | null;
  closedAt: string | null;
  messages: TicketMessage[];
}

export interface TicketStats {
  pending: number;
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface TicketsResponse {
  success: boolean;
  data: {
    tickets: Ticket[];
    pendingTickets: Ticket[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    stats: TicketStats;
  };
}

export interface TicketResponse {
  success: boolean;
  data: Ticket;
}

export interface TicketsFilters {
  page?: number;
  limit?: number;
  status?: "all" | "open" | "in-progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high";
  category?: string;
  assignedTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  viewMode?: "my-tickets" | "all";
}

/**
 * Fetch tickets with optional filters
 */
export async function getTickets(filters: TicketsFilters = {}): Promise<TicketsResponse> {
  const token = localStorage.getItem("authToken");

  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.category) params.append("category", filters.category);
  if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
  if (filters.viewMode) params.append("viewMode", filters.viewMode);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/tickets${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch tickets");
  }

  return await response.json();
}

/**
 * Get a single ticket by ID
 */
export async function getTicketById(ticketId: string, userId: string): Promise<TicketResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch ticket");
  }

  return await response.json();
}

/**
 * Assign ticket to current admin
 */
export async function assignTicket(
  ticketId: string,
  userId: string,
  status: string = "open"
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to assign ticket");
  }

  return await response.json();
}

/**
 * Update ticket
 */
export async function updateTicket(
  ticketId: string,
  userId: string,
  updates: {
    status?: string;
    priority?: string;
    category?: string;
    notes?: string;
    resolution?: string;
    assignedTo?: string;
  }
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update ticket");
  }

  return await response.json();
}

/**
 * Add message to ticket
 */
export async function addMessage(
  ticketId: string,
  userId: string,
  message: string,
  sender?: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, message, sender }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add message");
  }

  return await response.json();
}

/**
 * Delete ticket
 */
export async function deleteTicket(
  ticketId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}?userId=${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete ticket");
  }

  return await response.json();
}
