"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat, SupportTicket, Priority } from "@/contexts/ChatContext";
import { Avatar, Input, InputGroup, Whisper, Tooltip } from "rsuite";

// Time formatting helper
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Priority badge component
function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    urgent: { label: "Urgent", class: "priority-urgent" },
    high: { label: "High", class: "priority-high" },
    normal: { label: "Normal", class: "priority-normal" },
    low: { label: "Low", class: "priority-low" },
  };

  return (
    <span className={`chat-priority-badge ${config[priority].class}`}>
      {priority === "urgent" && (
        <span className="priority-pulse" />
      )}
      {config[priority].label}
    </span>
  );
}

// Account type badge
function AccountBadge({ type }: { type: "vip" | "premium" | "standard" }) {
  const config = {
    vip: { label: "VIP", class: "account-vip" },
    premium: { label: "Premium", class: "account-premium" },
    standard: { label: "Standard", class: "account-standard" },
  };

  return (
    <span className={`chat-account-badge ${config[type].class}`}>
      {config[type].label}
    </span>
  );
}

// Ticket list item
function TicketListItem({ ticket, onClick, isSelected }: { ticket: SupportTicket; onClick: () => void; isSelected: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chat-ticket-item ${isSelected ? "chat-ticket-item--selected" : ""} ${ticket.unreadCount > 0 ? "chat-ticket-item--unread" : ""}`}
    >
      <div className="chat-ticket-avatar">
        <Avatar
          circle
          size="sm"
          className={`!text-xs !font-semibold ${ticket.investor.accountType === "vip"
              ? "!bg-gradient-to-br !from-amber-500 !to-orange-600"
              : ticket.investor.accountType === "premium"
                ? "!bg-gradient-to-br !from-violet-500 !to-purple-600"
                : "!bg-gradient-to-br !from-slate-500 !to-slate-600"
            } !text-white`}
        >
          {ticket.investor.initials}
        </Avatar>
        {ticket.unreadCount > 0 && (
          <span className="chat-ticket-unread-dot" />
        )}
      </div>

      <div className="chat-ticket-content">
        <div className="chat-ticket-header">
          <span className="chat-ticket-name">{ticket.investor.name}</span>
          <span className="chat-ticket-time">{formatTimeAgo(ticket.lastMessageAt)}</span>
        </div>
        <div className="chat-ticket-subject">{ticket.subject}</div>
        <div className="chat-ticket-preview">{ticket.lastMessage}</div>
        <div className="chat-ticket-meta">
          <PriorityBadge priority={ticket.priority} />
          <AccountBadge type={ticket.investor.accountType} />
          <span className="chat-ticket-id">{ticket.id}</span>
        </div>
      </div>
    </button>
  );
}

// Conversation view
function ConversationView({ ticket, onBack }: { ticket: SupportTicket; onBack: () => void }) {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  // Simulate typing indicator
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timer);
  }, [isTyping]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(ticket.id, message.trim());
    setMessage("");
    // Simulate investor typing response
    setTimeout(() => setIsTyping(true), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-conversation">
      {/* Conversation header */}
      <div className="chat-conversation-header">
        <button type="button" onClick={onBack} className="chat-back-btn" aria-label="Back to list">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="chat-conversation-info">
          <Avatar
            circle
            size="sm"
            className={`!text-xs !font-semibold ${ticket.investor.accountType === "vip"
                ? "!bg-gradient-to-br !from-amber-500 !to-orange-600"
                : ticket.investor.accountType === "premium"
                  ? "!bg-gradient-to-br !from-violet-500 !to-purple-600"
                  : "!bg-gradient-to-br !from-slate-500 !to-slate-600"
              } !text-white`}
          >
            {ticket.investor.initials}
          </Avatar>
          <div className="chat-conversation-details">
            <div className="chat-conversation-name">
              {ticket.investor.name}
              <AccountBadge type={ticket.investor.accountType} />
            </div>
            <div className="chat-conversation-meta">
              {ticket.investor.email} · {ticket.investor.totalInvested}
            </div>
          </div>
        </div>

        <div className="chat-conversation-actions">
          <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Resolve ticket</Tooltip>}>
            <button type="button" className="chat-action-btn chat-action-btn--success" aria-label="Resolve ticket">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </Whisper>
          <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>More options</Tooltip>}>
            <button type="button" className="chat-action-btn" aria-label="More options">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </Whisper>
        </div>
      </div>

      {/* Subject bar */}
      <div className="chat-subject-bar">
        <span className="chat-subject-label">Subject:</span>
        <span className="chat-subject-text">{ticket.subject}</span>
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {ticket.messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.isAdmin ? "chat-message--admin" : "chat-message--investor"}`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {!msg.isAdmin && (
              <Avatar
                circle
                size="xs"
                className={`chat-message-avatar !text-[10px] !font-semibold ${ticket.investor.accountType === "vip"
                    ? "!bg-gradient-to-br !from-amber-500 !to-orange-600"
                    : ticket.investor.accountType === "premium"
                      ? "!bg-gradient-to-br !from-violet-500 !to-purple-600"
                      : "!bg-gradient-to-br !from-slate-500 !to-slate-600"
                  } !text-white`}
              >
                {ticket.investor.initials}
              </Avatar>
            )}
            <div className="chat-message-bubble">
              <div className="chat-message-content">{msg.content}</div>
              <div className="chat-message-time">
                {formatMessageTime(msg.timestamp)}
                {msg.isAdmin && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chat-message-read">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message chat-message--investor">
            <Avatar
              circle
              size="xs"
              className={`chat-message-avatar !text-[10px] !font-semibold ${ticket.investor.accountType === "vip"
                  ? "!bg-gradient-to-br !from-amber-500 !to-orange-600"
                  : "!bg-gradient-to-br !from-violet-500 !to-purple-600"
                } !text-white`}
            >
              {ticket.investor.initials}
            </Avatar>
            <div className="chat-typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-container">
          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Attach file</Tooltip>}>
            <button type="button" className="chat-attach-btn" aria-label="Attach file">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
          </Whisper>

          <InputGroup inside className="chat-input-group">
            <Input
              as="textarea"
              rows={1}
              placeholder="Type your message..."
              value={message}
              onChange={(value) => setMessage(value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
            />
          </InputGroup>

          <Whisper placement="top" trigger="hover" speaker={<Tooltip>Quick responses</Tooltip>}>
            <button type="button" className="chat-quick-btn" aria-label="Quick responses">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
          </Whisper>

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="chat-send-btn"
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Chat Panel
export default function ChatPanel() {
  const {
    isOpen,
    activeTab,
    selectedTicket,
    pendingTickets,
    activeTickets,
    setActiveTab,
    selectTicket,
  } = useChat();

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      {/* Glass overlay effect */}
      <div className="chat-panel-glow" />

      {selectedTicket ? (
        <ConversationView ticket={selectedTicket} onBack={() => selectTicket(null)} />
      ) : (
        <>
          {/* Header */}
          <div className="chat-panel-header">
            <div className="chat-panel-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chat-panel-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Investor Support</span>
            </div>
            <div className="chat-panel-stats">
              <span className="chat-stat">
                <span className="chat-stat-value">{pendingTickets.length}</span>
                <span className="chat-stat-label">Pending</span>
              </span>
              <span className="chat-stat">
                <span className="chat-stat-value">{activeTickets.length}</span>
                <span className="chat-stat-label">Active</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="chat-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`chat-tab ${activeTab === "pending" ? "chat-tab--active" : ""}`}
            >
              <span className="chat-tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span>Pending</span>
              {pendingTickets.length > 0 && (
                <span className="chat-tab-count">{pendingTickets.length}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("current")}
              className={`chat-tab ${activeTab === "current" ? "chat-tab--active" : ""}`}
            >
              <span className="chat-tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <span>Active</span>
              {activeTickets.length > 0 && (
                <span className="chat-tab-count chat-tab-count--active">{activeTickets.length}</span>
              )}
            </button>
          </div>

          {/* Ticket list */}
          <div className="chat-ticket-list">
            {activeTab === "pending" ? (
              pendingTickets.length > 0 ? (
                pendingTickets.map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => selectTicket(ticket)}
                    isSelected={false}
                  />
                ))
              ) : (
                <div className="chat-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="chat-empty-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="chat-empty-title">All caught up!</span>
                  <span className="chat-empty-text">No pending support tickets</span>
                </div>
              )
            ) : activeTickets.length > 0 ? (
              activeTickets.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => selectTicket(ticket)}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="chat-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="chat-empty-icon">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="chat-empty-title">No active chats</span>
                <span className="chat-empty-text">Start by responding to a pending ticket</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
