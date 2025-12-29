import React, { useState, useRef, useEffect } from "react";
import { Message, Session } from "../types";
import MessageList from "./MessageList";
import Composer from "./Composer";
import { getReplyForText } from "../utils/replies";

interface ChatSessionProps {
  session: Session;
  onSend: (message: Message) => void;
  onClear?: () => void;
  onDeleteMessage?: (id: number) => void;
}

/**
 * Chat session component that displays messages and handles user input.
 * Includes auto-scroll functionality and simulated bot responses.
 */
export default function ChatSession({
  session,
  onSend,
  onClear,
  onDeleteMessage,
}: ChatSessionProps) {
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  /**
   * Send user message and generate bot response.
   * Bot response is delayed by 700ms to simulate thinking time.
   */
  const send = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), from: "you", text: input };
    onSend(userMsg);
    setInput("");

    // Simulate bot thinking time before responding
    setTimeout(() => {
      const replyText = getReplyForText(userMsg.text);
      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: replyText,
      };
      onSend(botMsg);
    }, 700);
  };

  return (
    <div className="chat-session">
      <MessageList
        messages={session.messages}
        onDeleteMessage={onDeleteMessage}
      />
      <div ref={messagesEnd} />

      <Composer
        value={input}
        onChange={setInput}
        onSend={send}
        onClear={onClear}
      />
    </div>
  );
}
