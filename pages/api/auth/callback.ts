import { auth0 } from '../../../lib/auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleCallback(req, res);
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
