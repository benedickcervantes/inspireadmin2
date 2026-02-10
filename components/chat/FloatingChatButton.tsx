"use client";

import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "rsuite";

export default function FloatingChatButton() {
  const { isOpen, toggleChat, totalUnread } = useChat();

  return (
    <button
      type="button"
      onClick={toggleChat}
      className={`chat-fab ${isOpen ? "chat-fab--open" : ""}`}
      aria-label={isOpen ? "Close support chat" : "Open support chat"}
      aria-expanded={isOpen}
    >
      {/* Pulse rings */}
      <span className="chat-fab-pulse chat-fab-pulse--1" />
      <span className="chat-fab-pulse chat-fab-pulse--2" />

      {/* Main button content */}
      <span className="chat-fab-inner">
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chat-fab-icon">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="chat-fab-icon">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="8" cy="12" r="1" fill="currentColor" />
            <circle cx="16" cy="12" r="1" fill="currentColor" />
          </svg>
        )}
      </span>

      {/* Unread badge */}
      {totalUnread > 0 && !isOpen && (
        <span className="chat-fab-badge">
          {totalUnread > 99 ? "99+" : totalUnread}
        </span>
      )}

      {/* Tooltip */}
      <span className="chat-fab-tooltip">
        {isOpen ? "Close" : `Support ${totalUnread > 0 ? `(${totalUnread})` : ""}`}
      </span>
    </button>
  );
}
