    import { auth0 } from '../../../lib/auth0';
    import type { NextApiRequest, NextApiResponse } from 'next';

    export default async function login(req: NextApiRequest, res: NextApiResponse) {
      try {
        await auth0.handleLogin(req, res);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
    }
