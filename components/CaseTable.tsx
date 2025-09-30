import { CaseEntry } from '../types/case';

type Props = {
  cases: CaseEntry[];
  visibleCount: number;
  onShowAll: () => void;
  onExportCSV: () => void;
};

export default function CaseTable({ cases, visibleCount, onShowAll, onExportCSV }: Props) {
  return (
    <div>
      <button onClick={onShowAll}>Show All</button>
      <button onClick={onExportCSV}>Export to CSV</button>
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
          {cases.slice(0, visibleCount).map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.respondent}</td>
              <td>{entry.description}</td>
              <td>{entry.orderType}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }
