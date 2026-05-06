import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_PAYMENTS = [
  { id: "PAY001", booking: "TG00000001", amount: 680, method: "UPI", status: "success", date: "May 4, 2026" },
  { id: "PAY002", booking: "TG00000002", amount: 1200, method: "Cash", status: "pending", date: "May 5, 2026" },
  { id: "PAY003", booking: "TG00000003", amount: 890, method: "Card", status: "refunded", date: "May 1, 2026" },
  { id: "PAY004", booking: "TG00000004", amount: 450, method: "UPI", status: "success", date: "May 6, 2026" },
  { id: "PAY005", booking: "TG00000005", amount: 2500, method: "Wallet", status: "success", date: "May 6, 2026" },
];

function StatCard({ icon, label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {hint ? <div className="stat-card-change">{hint}</div> : null}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(data);
  }, []);

  const dashboardStats = useMemo(() => {
    const total = bookings.length;
  
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const revenue = bookings.reduce((sum, b) => sum + (b.fare || 0), 0);

    return { total, confirmed, cancelled, revenue };
  }, [bookings]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <nav className="navbar">
        <button
          onClick={() => navigate("/home")}
          style={{ background: "none", border: "none", color: "#475569", fontSize: "0.9rem", cursor: "pointer" }}
        >
          ⇦ Back to App
        </button>
        <div className="nav-logo">TravelGo Admin</div>
        <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Dashboard</span>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        <div className="admin-header">
          <h1>📊 Dashboard</h1>
          <p>Quick summary of bookings and payments</p>
        </div>

        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <StatCard icon="📋" label="Total Bookings" value={dashboardStats.total} hint="From local bookings data" />
          <StatCard icon="✅" label="Confirmed" value={dashboardStats.confirmed} />
          <StatCard icon="❌" label="Cancelled" value={dashboardStats.cancelled} />
          <StatCard icon="💰" label="Revenue" value={`₹${dashboardStats.revenue.toLocaleString()}`} />
        </div>

        <div className="data-table-wrap" style={{ marginBottom: "1.5rem" }}>
          <div className="data-table-header">
            <h3>Recent Bookings</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Vehicle</th><th>From</th><th>To</th><th>Fare</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "1.5rem", color: "#64748b" }}>No bookings yet</td></tr>
              ) : bookings.slice(0, 10).map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: "monospace", color: "#64748b" }}>#{b.id}</td>
                  <td>{b.vehicle?.emoji} {b.vehicle?.name}</td>
                  <td>{b.pickup}</td>
                  <td>{b.drop}</td>
                  <td style={{ fontWeight: 600 }}>₹{b.fare}</td>
                  <td>
                    <span className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "cancelled" ? "badge-danger" : "badge-info"}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="data-table-wrap">
          <div className="data-table-header">
            <h3>Recent Payments</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Payment ID</th><th>Booking</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {MOCK_PAYMENTS.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: "monospace", color: "#64748b" }}>{p.id}</td>
                  <td>#{p.booking}</td>
                  <td style={{ fontWeight: 600 }}>₹{p.amount}</td>
                  <td>{p.method}</td>
                  <td>{p.date}</td>
                  <td>
                    <span className={`badge ${p.status === "success" ? "badge-success" : p.status === "pending" ? "badge-warning" : "badge-danger"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
