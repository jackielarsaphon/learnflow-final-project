export default function ProgressBar({ value, label = 'ความคืบหน้าการเรียน' }) {
  return <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${value}%` }} /></div>;
}
