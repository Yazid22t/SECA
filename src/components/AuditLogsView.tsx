import { useEffect, useState } from "react";

export default function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await fetch("http://127.0.0.1:8000/audit");
    const data = await res.json();
    setLogs(data);
  };

  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            {log.action} - {log.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
