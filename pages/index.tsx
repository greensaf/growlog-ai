import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import GrowlogApp from '../GrowlogApp.tsx';


function Home({ user }: any) {
  return (
    <div className='text-center mt-20 text-2xl font-bold'>
      👤 Привет, {user.name}!
      <br />
      🌿 Growlog AI запущен успешно!
      <br />
      <a
        href='/api/auth/logout'
        className='mt-4 inline-block text-blue-500 underline'
      >
        Выйти
      </a>
      <GrowlogApp />
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();

export default Home;