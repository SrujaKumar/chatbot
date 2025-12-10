export type Message = { id: number; from: "bot" | "you"; text: string };
export type Session = { id: number; title: string; messages: Message[] };
