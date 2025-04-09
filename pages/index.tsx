// pages/index.tsx
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import GrowlogApp from '@/components/GrowlogApp';


export const getServerSideProps = withPageAuthRequired();

export default function Home() {
  return <GrowlogApp />;
}
