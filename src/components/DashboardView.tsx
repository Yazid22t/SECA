import { useEffect, useState } from "react";

export default function DashboardView() {
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const res = await fetch("http://127.0.0.1:8000/scans");
    const data = await res.json();
    setScans(data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {scans.map((scan, i) => (
          <li key={i}>
            {scan.target} - {scan.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
