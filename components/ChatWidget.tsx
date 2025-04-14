'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, SendHorizontal } from "lucide-react";
import { useState } from "react";

export function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: "agent", text: "Hi, how can I help you today?" },
    { from: "user", text: "Hey, I'm having trouble with my account." },
    { from: "agent", text: "What seems to be the problem?" },
    { from: "user", text: "I can't log in." },
  ]);
  const [input, setInput] = useState("");

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

      <Separator />

      <ScrollArea className="h-[300px] px-4 py-2 space-y-2 flex-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md w-max max-w-[80%] ${
              msg.from === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t">
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