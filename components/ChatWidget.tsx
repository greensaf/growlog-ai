// ChatWidget.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, ListTodo } from 'lucide-react';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { ThemeToggle } from '@/components/ThemeToggle';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      from: 'agent',
      text: `🌿 Today's Grow Data:

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

🧪 Notes: Slight yellowing observed on lower leaves.`,
    },
    { from: 'agent', text: 'Hi, how can I help you today?' },
    { from: 'user', text: "Hey, I'm having trouble with my account." },
    { from: 'agent', text: 'What seems to be the problem?' },
    { from: 'user', text: "I can't log in." },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  function handleSend(text: string) {
    if (!text.trim()) return;
    setMessages([...messages, { from: 'user', text }]);
  }

  return (
    <div className='w-screen h-screen bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'>
      <Card className='w-full h-full flex flex-col border-0 shadow-none rounded-none bg-background text-foreground'>
        {/* Sticky header */}
        <div className='sticky top-0 z-50 px-4 sm:px-6 md:px-8 lg:px-12 py-4 flex items-center gap-3 bg-background border-b'>
          <Avatar>
            <AvatarImage src='/images/ava.jpg' />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium text-base sm:text-lg md:text-xl'>
              Growlog
            </span>
            <span className='text-sm sm:text-base text-muted-foreground'>
              journal with neuro
            </span>
          </div>
          <div className='ml-auto flex items-center gap-0.5'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='w-10 h-10'>
                  <Menu size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' className='w-48'>
                <DropdownMenuItem onClick={() => alert('Profile clicked')}>
                  ⚇ Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Web3 clicked')}>
                  ⑆ Web3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Reports clicked')}>
                  ⎙ Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Settings')}>
                  ⚙︎ Options
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = '/api/auth/logout')}
                >
                  ⍅ Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant='ghost'
              size='icon'
              className='w-10 h-10'
              onClick={() => alert('List to do clicked')}
            >
              <ListTodo size={22} />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Chat scroll area */}
        <div
          ref={scrollRef}
          className='flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 pb-[104px]'
        >
          <div className='flex flex-col gap-6'>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                from={msg.from as 'user' | 'agent'}
                text={msg.text}
              />
            ))}
          </div>
        </div>

        {/* Bottom input area */}
        <div className='shrink-0'>
          <ChatInput
            isRecording={isRecording}
            toggleRecording={() => setIsRecording(!isRecording)}
            handleSend={handleSend}
          />
        </div>
      </Card>
    </div>
  );
}
