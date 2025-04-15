'use client';

interface ChatMessageProps {
  from: "user" | "agent";
  text: string;
}

export function ChatMessage({ from, text }: ChatMessageProps) {
  return (
    <div
      className={`px-4 py-2 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl leading-snug break-words ${
        from === "user"
          ? "bg-primary text-primary-foreground ml-auto"
          : "bg-muted text-muted-foreground self-start"
      } max-w-[80%]`}
    >
      {text}
    </div>
  );
}