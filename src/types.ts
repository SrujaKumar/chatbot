/**
 * Represents a single chat message.
 */
export type Message = { 
  id: number; 
  from: "bot" | "you"; 
  text: string 
};

/**
 * Represents a chat session containing multiple messages.
 */
export type Session = { 
  id: number; 
  title: string; 
  messages: Message[] 
};
