"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type Priority = "urgent" | "high" | "normal" | "low";
export type TicketStatus = "pending" | "active" | "resolved";

export interface Investor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  accountType: "premium" | "standard" | "vip";
  totalInvested?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
  attachments?: { name: string; url: string; type: string }[];
  read?: boolean;
}

export interface SupportTicket {
  id: string;
  investor: Investor;
  subject: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: Date;
  lastMessageAt: Date;
  lastMessage: string;
  messages: Message[];
  unreadCount: number;
}

interface ChatContextType {
  isOpen: boolean;
  activeTab: "pending" | "current";
  selectedTicket: SupportTicket | null;
  pendingTickets: SupportTicket[];
  activeTickets: SupportTicket[];
  totalUnread: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setActiveTab: (tab: "pending" | "current") => void;
  selectTicket: (ticket: SupportTicket | null) => void;
  sendMessage: (ticketId: string, content: string, attachments?: File[]) => void;
  markAsRead: (ticketId: string) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data for demonstration
const mockInvestors: Investor[] = [
  { id: "1", name: "Alexander Chen", email: "alex.chen@email.com", initials: "AC", accountType: "vip", totalInvested: "$2.4M" },
  { id: "2", name: "Sarah Mitchell", email: "s.mitchell@email.com", initials: "SM", accountType: "premium", totalInvested: "$850K" },
  { id: "3", name: "James Rodriguez", email: "j.rodriguez@email.com", initials: "JR", accountType: "standard", totalInvested: "$125K" },
  { id: "4", name: "Emily Watson", email: "e.watson@email.com", initials: "EW", accountType: "premium", totalInvested: "$1.2M" },
  { id: "5", name: "Michael Park", email: "m.park@email.com", initials: "MP", accountType: "vip", totalInvested: "$3.8M" },
];

const generateMockTickets = (): SupportTicket[] => [
  {
    id: "TKT-001",
    investor: mockInvestors[0],
    subject: "Wire Transfer Delay",
    priority: "urgent",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
    lastMessage: "I've been waiting for 3 days for my wire transfer to process. This is unacceptable for a VIP account.",
    unreadCount: 3,
    messages: [
      { id: "m1", content: "Hello, I initiated a wire transfer 3 days ago and it still hasn't arrived.", timestamp: new Date(Date.now() - 1000 * 60 * 45), isAdmin: false },
      { id: "m2", content: "I've been waiting for 3 days for my wire transfer to process. This is unacceptable for a VIP account.", timestamp: new Date(Date.now() - 1000 * 60 * 5), isAdmin: false },
    ],
  },
  {
    id: "TKT-002",
    investor: mockInvestors[1],
    subject: "Portfolio Rebalancing Question",
    priority: "normal",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
    lastMessage: "Can you explain the automatic rebalancing feature? I want to understand how it works.",
    unreadCount: 1,
    messages: [
      { id: "m3", content: "Can you explain the automatic rebalancing feature? I want to understand how it works.", timestamp: new Date(Date.now() - 1000 * 60 * 30), isAdmin: false },
    ],
  },
  {
    id: "TKT-003",
    investor: mockInvestors[2],
    subject: "Account Verification Issue",
    priority: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
    lastMessage: "My KYC verification has been stuck for a week. I've submitted all documents twice.",
    unreadCount: 2,
    messages: [
      { id: "m4", content: "My KYC verification has been stuck for a week. I've submitted all documents twice.", timestamp: new Date(Date.now() - 1000 * 60 * 60), isAdmin: false },
    ],
  },
  {
    id: "TKT-004",
    investor: mockInvestors[3],
    subject: "Dividend Distribution Inquiry",
    priority: "low",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 10),
    lastMessage: "Thank you for the clarification. One more question about the tax implications.",
    unreadCount: 1,
    messages: [
      { id: "m5", content: "When will the Q4 dividends be distributed?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isAdmin: false },
      { id: "m6", content: "Hi Emily, Q4 dividends are scheduled for distribution on January 15th. You'll receive a notification 48 hours before.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), isAdmin: true },
      { id: "m7", content: "Thank you for the clarification. One more question about the tax implications.", timestamp: new Date(Date.now() - 1000 * 60 * 10), isAdmin: false },
    ],
  },
  {
    id: "TKT-005",
    investor: mockInvestors[4],
    subject: "API Access Request",
    priority: "normal",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 2),
    lastMessage: "I'll review the documentation and get back to you if I have questions.",
    unreadCount: 0,
    messages: [
      { id: "m8", content: "I'd like to request API access for my trading algorithms.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isAdmin: false },
      { id: "m9", content: "Of course, Michael. As a VIP client, you have access to our premium API tier. I'm sending you the documentation and credentials now.", timestamp: new Date(Date.now() - 1000 * 60 * 30), isAdmin: true },
      { id: "m10", content: "I'll review the documentation and get back to you if I have questions.", timestamp: new Date(Date.now() - 1000 * 60 * 2), isAdmin: false, read: true },
    ],
  },
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "current">("pending");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(generateMockTickets);

  const pendingTickets = useMemo(
    () => tickets.filter((t) => t.status === "pending").sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    [tickets]
  );

  const activeTickets = useMemo(
    () => tickets.filter((t) => t.status === "active").sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()),
    [tickets]
  );

  const totalUnread = useMemo(
    () => tickets.reduce((sum, t) => sum + t.unreadCount, 0),
    [tickets]
  );

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setSelectedTicket(null);
  }, []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const selectTicket = useCallback((ticket: SupportTicket | null) => {
    setSelectedTicket(ticket);
    if (ticket) {
      // Mark messages as read
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id ? { ...t, unreadCount: 0, messages: t.messages.map((m) => ({ ...m, read: true })) } : t
        )
      );
    }
  }, []);

  const sendMessage = useCallback((ticketId: string, content: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content,
      timestamp: new Date(),
      isAdmin: true,
      read: true,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: content,
              lastMessageAt: new Date(),
              status: "active" as TicketStatus,
            }
          : t
      )
    );

    // Update selected ticket if it's the one we're messaging
    setSelectedTicket((prev) =>
      prev?.id === ticketId
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: content,
            lastMessageAt: new Date(),
            status: "active",
          }
        : prev
    );
  }, []);

  const markAsRead = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, unreadCount: 0 } : t
      )
    );
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status } : t
      )
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        activeTab,
        selectedTicket,
        pendingTickets,
        activeTickets,
        totalUnread,
        openChat,
        closeChat,
        toggleChat,
        setActiveTab,
        selectTicket,
        sendMessage,
        markAsRead,
        updateTicketStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
