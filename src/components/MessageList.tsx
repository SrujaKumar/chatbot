import React from "react";
import { Message } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

type Props = {
  messages: Message[];
  onDeleteMessage?: (id: number) => void;
};

export default function MessageList({ messages, onDeleteMessage }: Props) {
  return (
    <div className="messages">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`message ${m.from === "bot" ? "bot" : "you"}`}
        >
          <div className="avatar">
            {m.from === "bot" ? (
              <FontAwesomeIcon
                icon={faRobot}
                style={{ fontSize: 18, color: "#6b6b6b" }}
                aria-hidden="true"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: 16, color: "#6b6b6b" }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="bubble">{m.text}</div>
          <button
            className="msg-delete"
            onClick={() => onDeleteMessage?.(m.id)}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
