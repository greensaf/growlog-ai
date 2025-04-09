import { auth0 } from '../../../lib/auth0';

export default async function me(req, res) {
  try {
    const session = await auth0.getSession(req, res);
    res.status(200).json(session?.user || null);
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
