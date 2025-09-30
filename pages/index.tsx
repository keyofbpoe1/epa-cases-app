import { GetServerSideProps } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { useState } from 'react';

type CaseEntry = {
  respondent: string;
  description: string;
  orderType: string;
  date: string;
};

type Props = {
  cases: CaseEntry[];
};

export default function Home({ cases }: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleCases = showAll ? cases : cases.slice(0, 10);

  const handleToggleView = () => setShowAll(prev => !prev);

  const handleExportCSV = () => {
    const header = ['Respondent', 'Description', 'Order Type', 'Date'];
    const rows = cases.map(c => [c.respondent, c.description, c.orderType, c.date]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map(e => e.map(v => `"${v}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'epa_cases.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main>
      <h1>EPA Civil and Cleanup Enforcement Cases</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleToggleView}>
          {showAll ? 'Show Top 10' : 'Show All'}
        </button>
        <button onClick={handleExportCSV} style={{ marginLeft: '1rem' }}>
          Export to CSV
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Respondent</th>
            <th>Description</th>
            <th>Order Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {visibleCases.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.respondent}</td>
              <td>{entry.description}</td>
              <td>{entry.orderType}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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

  return { props: { cases } };
};