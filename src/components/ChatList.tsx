import React from "react";
import { Session } from "../types";

type Props = {
  sessions: Session[];
  activeId: number;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onDelete?: (id: number) => void;
};

/**
 * Sidebar component displaying list of chat sessions.
 * Allows users to switch between chats, create new ones, and delete existing ones.
 */
export default function ChatList({
  sessions,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  return (
    <div className="chat-list">
      {sessions.map((s) => (
        <div
          key={s.id}
          className={`chat-item ${s.id === activeId ? "active" : ""}`}
        >
          <div className="chat-title" onClick={() => onSelect(s.id)}>
            {s.title}
          </div>
          <div className="chat-actions">
            <button onClick={() => onSelect(s.id)}>Open</button>
            {onDelete && <button onClick={() => onDelete(s.id)}>Delete</button>}
          </div>
        </div>
      ))}
      <button className="new-btn" onClick={onCreate}>
        + New Chat
      </button>
    </div>
  );
}
