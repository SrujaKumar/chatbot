import React, { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatSession from "./components/ChatSession";
import { Message, Session } from "./types";

export default function ChatApp() {
  const initial = (): Session[] => {
    try {
      const raw = localStorage.getItem("chat_sessions");
      if (raw) return JSON.parse(raw);
    } catch {
      // Invalid JSON or missing storage - use default
    }
    return [
      {
        id: 1,
        title: "Chat 1",
        messages: [
          { id: 1, from: "bot", text: "Hello! How can I help you today?" },
        ],
      },
    ];
  };

  const [sessions, setSessions] = useState<Session[]>(initial);
  const [activeId, setActiveId] = useState<number>(sessions[0]?.id ?? 1);

  const addMessage = (sessionId: number, message: Message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, message] } : s
      )
    );
  };

  const removeSession = (id: number) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);

      // Reindex sessions to maintain sequential IDs
      const reindexed = remaining.map((s, idx) => ({
        ...s,
        id: idx + 1,
        title: `Chat ${idx + 1}`,
      }));

      // Update active session if needed
      if (reindexed.length > 0 && !reindexed.find((s) => s.id === activeId)) {
        setActiveId(reindexed[0].id);
      } else if (reindexed.length === 0) {
        setActiveId(-1);
      }

      return reindexed;
    });
  };

  const clearMessages = (sessionId: number) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, messages: [] } : s))
    );
  };

  const createSession = () => {
    const maxId = sessions.length ? Math.max(...sessions.map((s) => s.id)) : 0;
    const nextId = maxId + 1;
    const newSession: Session = {
      id: nextId,
      title: `Chat ${nextId}`,
      messages: [
        { id: 1, from: "bot", text: "Hello! How can I help you today?" },
      ],
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveId(nextId);
  };

  const activeSession = sessions.find((s) => s.id === activeId);

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Chats</h3>
        <ChatList
          sessions={sessions}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={createSession}
          onDelete={removeSession}
        />
      </div>
      <div className="main">
        <header className="header">Chatbot</header>
        {activeSession ? (
          <ChatSession
            session={activeSession}
            onSend={(msg) => addMessage(activeId, msg)}
            onClear={() => clearMessages(activeId)}
            onDeleteMessage={(mid) =>
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeId
                    ? { ...s, messages: s.messages.filter((m) => m.id !== mid) }
                    : s
                )
              )
            }
          />
        ) : (
          <div className="empty">No session selected</div>
        )}
      </div>
    </div>
  );
}
