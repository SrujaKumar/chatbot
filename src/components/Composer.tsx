import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onClear?: () => void;
};

/**
 * Message input component with send and clear functionality.
 * Supports Enter key to send messages.
 */
export default function Composer({ value, onChange, onSend, onClear }: Props) {
  return (
    <div className="composer">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>Send</button>
      <button onClick={() => onClear?.()}>Clear</button>
    </div>
  );
}
