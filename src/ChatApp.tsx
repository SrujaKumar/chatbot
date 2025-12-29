import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatSession from "./components/ChatSession";
import { Message, Session } from "./types";

/**
 * Main chat application component that manages multiple chat sessions.
 * Handles session creation, deletion, message management, and routing.
 */
export default function ChatApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract chat ID from pathname (e.g., /chat1 -> "1")
  const chatId = location.pathname.replace('/chat', '');
  
  /**
   * Initialize sessions from localStorage or return default session.
   * @returns Array of chat sessions
   */
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
  
  // Determine active session ID from URL or fallback to first session
  const activeId = chatId ? parseInt(chatId) : sessions[0]?.id ?? 1;

  /**
   * Add a message to a specific session.
   * @param sessionId - ID of the session to add the message to
   * @param message - Message object to add
   */
  const addMessage = (sessionId: number, message: Message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, message] } : s
      )
    );
  };

  /**
   * Remove a session and reindex remaining sessions.
   * Navigates to first session if the current one is deleted.
   * @param id - ID of the session to remove
   */
  const removeSession = (id: number) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);

      // Reindex sessions to maintain sequential IDs starting from 1
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

  /**
   * Clear all messages from a specific session.
   * @param sessionId - ID of the session to clear
   */
  const clearMessages = (sessionId: number) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, messages: [] } : s))
    );
  };

  /**
   * Create a new chat session and navigate to it.
   */
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

  /**
   * Navigate to a specific chat session.
   * @param id - ID of the session to navigate to
   */
  const selectSession = (id: number) => {
    navigate(`/chat${id}`);
  };

  // Find the currently active session based on URL
  const activeSession = sessions.find((s) => s.id === activeId);

  /**
   * Delete a specific message from the active session.
   * @param messageId - ID of the message to delete
   */
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

  // Persist sessions to localStorage whenever they change
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
