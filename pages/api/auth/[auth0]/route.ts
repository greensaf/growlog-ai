import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
} from '@auth0/nextjs-auth0/edge';

export const GET = handleAuth({
  login: handleLogin,
  logout: handleLogout,
  callback: handleCallback,
});
