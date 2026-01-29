"use client";

import FloatingChatButton from "./FloatingChatButton";
import ChatPanel from "./ChatPanel";

export default function ChatSystem() {
  return (
    <>
      <ChatPanel />
      <FloatingChatButton />
    </>
  );
}

export { FloatingChatButton, ChatPanel };
