'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: "agent", text: `🌿 Today's Grow Data:

• Strain: OG Kush
• Plant ID: A1
• Air Temp: 26°C
• Substrate Temp: 22°C
• Humidity: 55%
• EC: 1.8
• pH: 6.2
• CO₂: 800 ppm
• VPD: 1.1 kPa
• PPFD: 550 µmol/m²/s
• Irrigation: 3x/day

🧪 Notes: Slight yellowing observed on lower leaves.` },
    { from: "agent", text: "Hi, how can I help you today?" },
    { from: "user", text: "Hey, I'm having trouble with my account." },
    { from: "agent", text: "What seems to be the problem?" },
    { from: "user", text: "I can't log in." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      container.style.scrollBehavior = 'smooth';
    }
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  }

  return (
    <Card className="w-[350px] rounded-xl shadow-md flex flex-col overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Sofia Davis</span>
          <span className="text-sm text-muted-foreground">m@example.com</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Plus size={18} />
        </Button>
      </div>

      <ScrollArea
        ref={scrollRef}
        className="h-[300px] px-4 py-4 flex flex-col gap-6 flex-1 overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-lg text-sm leading-snug break-words ${
              msg.from === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted text-muted-foreground self-start"
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <SendHorizontal size={16} />
        </Button>
      </form>
    </Card>
  );
}