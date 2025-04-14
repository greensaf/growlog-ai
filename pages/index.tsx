// pages/index.tsx
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import GrowlogApp from '@/components/GrowlogApp';
import { ChatWidget } from "@/components/ChatWidget";

export const getServerSideProps = withPageAuthRequired();

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <ChatWidget />
    </main>
  );
}

//      <GrowlogApp />;
