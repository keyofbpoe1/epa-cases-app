import axios from 'axios';
import * as cheerio from 'cheerio';
import { CaseEntry } from '../types/case';

export async function scrapeEPACases(): Promise<CaseEntry[]> {
  const url = 'https://www.epa.gov/enforcement/civil-and-cleanup-enforcement-cases-and-settlements';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const cases: CaseEntry[] = [];

  $('table tbody tr').each((_, el) => {
    const tds = $(el).find('td');
    cases.push({
      respondent: $(tds[0]).text().trim(),
      description: $(tds[1]).text().trim(),
      orderType: $(tds[2]).text().trim(),
      date: $(tds[3]).text().trim(),
    });
  });

  return cases;
}