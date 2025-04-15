'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [isRecording, setIsRecording] = useState(false);
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
    <div className="w-screen min-h-[100dvh] bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <Card className="w-full h-full rounded-none bg-background text-foreground flex flex-col overflow-hidden border-0 shadow-none">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-base sm:text-lg md:text-xl">Gaia</span>
            <span className="text-sm sm:text-base text-muted-foreground">master-grower</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Plus size={22} />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea
            ref={scrollRef}
            className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {messages.map((msg, index) => (
                <ChatMessage key={index} from={msg.from as "user" | "agent"} text={msg.text} />
              ))}
            </div>
          </ScrollArea>

          <ChatInput
            input={input}
            setInput={setInput}
            isRecording={isRecording}
            toggleRecording={() => setIsRecording(!isRecording)}
            handleSend={handleSend}
          />
        </div>
      </Card>
    </div>
  );
}