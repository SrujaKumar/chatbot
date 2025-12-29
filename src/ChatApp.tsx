import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatSession from "./components/ChatSession";
import { Message, Session } from "./types";

export default function ChatApp() {
  const navigate = useNavigate();
  const { chatId: chatParam } = useParams<{ chatId: string }>();
  
  const chatId = chatParam?.replace('chat', '') || '';
  
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
  const activeId = chatId ? parseInt(chatId) : sessions[0]?.id ?? 1;

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

      if (reindexed.length > 0 && !reindexed.find((s) => s.id === activeId)) {
        navigate(`/chat${reindexed[0].id}`);
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
    navigate(`/chat${nextId}`);
  };

  const selectSession = (id: number) => {
    navigate(`/chat${id}`);
  };

  const activeSession = sessions.find((s) => s.id === activeId);

  const deleteMessage = (messageId: number) => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? { ...s, messages: s.messages.filter((m) => m.id !== messageId) }
          : s
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Chats</h3>
        <ChatList
          sessions={sessions}
          activeId={activeId}
          onSelect={selectSession}
          onCreate={createSession}
          onDelete={removeSession}
        />
      </div>
      <div className="main">
        <header className="header">Chatbot</header>
        {activeSession ? (
          <ChatSession
            session={activeSession}
            onSend={(msg) => addMessage(activeSession.id, msg)}
            onClear={() => clearMessages(activeSession.id)}
            onDeleteMessage={deleteMessage}
          />
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Select a chat or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
