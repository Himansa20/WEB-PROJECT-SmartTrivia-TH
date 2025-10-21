import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api/http";

function LineChart({ data, series, height = 180, padding = 24 }) {
  const width = Math.max(360, (data?.length || 0) * 36);
  const values = data.flatMap((d) => series.map((s) => d[s.key] || 0));
  const maxY = Math.max(1, ...values);
  const stepX = (width - padding * 2) / Math.max(1, (data.length - 1));

  const buildPath = (key) => {
    if (!data.length) return "";
    return data
      .map((d, i) => {
        const x = padding + i * stepX;
        const y =
          height - padding - (Number(d[key] || 0) / maxY) * (height - padding * 2);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const xLabels = data.map((d, i) => ({
    x: padding + i * stepX,
    text: d.date.slice(5), 
  }));

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={width} height={height}>
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
        />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />

        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = height - padding - t * (height - padding * 2);
          const val = Math.round(maxY * t);
          return (
            <g key={i}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" />
              <text x={8} y={y + 4} fontSize="11" fill="#94a3b8">
                {val}
              </text>
            </g>
          );
        })}

        {series.map((s) => (
          <path key={s.key} d={buildPath(s.key)} fill="none" stroke={s.stroke} strokeWidth="2.5" />
        ))}

        {xLabels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={height - padding + 14}
            fontSize="11"
            textAnchor="middle"
            fill="#94a3b8"
          >
            {l.text}
          </text>
        ))}

        <g transform={`translate(${padding}, ${padding - 8})`}>
          {series.map((s, i) => (
            <g key={s.key} transform={`translate(${i * 120}, 0)`}>
              <rect width="14" height="4" rx="2" ry="2" fill={s.stroke} />
              <text x="20" y="4" fontSize="12" fill="#334155">
                {s.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, quizzes: 0, reports: 0, approvals: 0 });
  const [trend, setTrend] = useState([]); 
  const [notes, setNotes] = useState([]); 
  const [unread, setUnread] = useState(0);
  const sinceRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats({
          users: Number(data?.users ?? 0),
          quizzes: Number(data?.quizzes ?? 0),
          reports: Number(data?.reports ?? 0),
          approvals: Number(data?.approvals ?? 0),
        });
      } catch {
        setStats({ users: 5, quizzes: 10, reports: 0, approvals: 3 });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/trends", { params: { days: 14 } });
        setTrend(data?.byDay || []);
      } catch {
        setTrend([]);
      }
    })();
  }, []);

  useEffect(() => {
    let canceled = false;

    const poll = async () => {
      try {
        const { data } = await api.get("/admin/notifications", {
          params: sinceRef.current ? { since: sinceRef.current } : {},
        });

        if (!canceled && data?.items) {
          if (sinceRef.current) {
            const fresh = data.items; 
            if (fresh.length) {
              setNotes((prev) => [...fresh, ...prev].slice(0, 30)); 
              setUnread((u) => u + fresh.length);
            }
          } else {

            setNotes(data.items);
          }
          sinceRef.current = data.now || new Date().toISOString();
        }
      } catch {
      }
    };

    poll();
    const id = setInterval(poll, 10000); 
    return () => {
      canceled = true;
      clearInterval(id);
    };
  }, []);

  const series = useMemo(
    () => [
      { key: "users", label: "Users", stroke: "#22c55e" },
      { key: "quizzes", label: "Quizzes", stroke: "#3b82f6" },
    ],
    []
  );

  const clearUnread = () => setUnread(0);

  return (
    <div className="ad-dashboard">
      <h2>Dashboard</h2>

      <div className="ad-cards">
        <div className="ad-card">
          <div className="ad-card-title">Total Users</div>
          <div className="ad-card-value">{Number(stats.users ?? 0)}</div>
        </div>
        <div className="ad-card">
          <div className="ad-card-title">Total Quizzes</div>
          <div className="ad-card-value">{Number(stats.quizzes ?? 0)}</div>
        </div>
        <div className="ad-card">
          <div className="ad-card-title">Reports Generated</div>
          <div className="ad-card-value">{Number(stats.reports ?? 0)}</div>
        </div>
        <div className="ad-card">
          <div className="ad-card-title">Pending Approvals</div>
          <div className="ad-card-value">{Number(stats.approvals ?? 0)}</div>
        </div>
      </div>

      <div className="ad-panels">
        <div className="ad-panel">
          <div className="ad-panel-title">Users & Quiz Trends (last 14 days)</div>
          <div className="ad-panel-body">
            {trend.length ? (
              <LineChart data={trend} series={series} />
            ) : (
              <div className="ad-empty">No data yet</div>
            )}
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-title" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Notifications</span>
            <span className="ad-badge warn" style={{ cursor: "pointer" }} onClick={clearUnread}>
              {unread} new
            </span>
          </div>
          <div className="ad-panel-body" style={{ maxHeight: 280, overflow: "auto" }}>
            {!notes.length ? (
              <div className="ad-empty">No notifications</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {notes.map((n) => (
                  <li
                    key={n._id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      background: "#fff",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>
                      New user: {n.name || "—"} <span className="ad-field-hint">({n.email})</span>
                    </div>
                    <div className="ad-field-hint">
                      Joined {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
