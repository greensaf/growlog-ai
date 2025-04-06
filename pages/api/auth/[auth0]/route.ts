import {
  handleLogin,
  handleLogout,
  handleCallback,
} from '@auth0/nextjs-auth0/edge';

export const GET = async (req: Request) => {
  const { pathname } = new URL(req.url);

  if (pathname.includes('/login')) {
    return handleLogin(req);
  }

  if (pathname.includes('/logout')) {
    return handleLogout(req);
  }

  if (pathname.includes('/callback')) {
    return handleCallback(req);
  }

  return new Response('Not found', { status: 404 });
};
