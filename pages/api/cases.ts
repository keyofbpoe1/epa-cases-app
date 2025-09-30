import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeEPACases } from '../../utils/scrapeEPA';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cases = await scrapeEPACases();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch EPA cases' });
  }
}