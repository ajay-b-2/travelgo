import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", badgeClass: "badge-success", icon: "✅" },
  completed: { label: "Completed", badgeClass: "badge-info", icon: "🏁" },
  cancelled: { label: "Cancelled", badgeClass: "badge-danger", icon: "❌" },
  pending: { label: "Pending", badgeClass: "badge-warning", icon: "⏳" },
};

const VEHICLE_IMAGES = {
  sedan: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&q=80",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80",
  auto: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80",
  luxury: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80",
  bike: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&q=80",
  "mini-truck": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80",
  tempo: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&q=80",
  "large-truck": "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=900&q=80",
  "bike-delivery": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80",
};

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{t.icon}</span>
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-message">{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings") || "[]");
    if (data.length === 0) {
      // Demo data
      const demo = [
        {
          id: "TG00000001",
          vehicle: { id: "sedan", emoji: "🚗", name: "City Sedan", image: VEHICLE_IMAGES.sedan },
          pickup: "Connaught Place, Delhi",
          drop: "IGI Airport, Delhi",
          fare: 680,
          payment: "upi",
          status: "completed",
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          category: "passenger",
        },
        {
          id: "TG00000002",
          vehicle: { id: "mini-truck", emoji: "🚛", name: "Mini Truck", image: VEHICLE_IMAGES["mini-truck"] },
          pickup: "Lajpat Nagar",
          drop: "Gurgaon Sector 56",
          fare: 1200,
          payment: "cash",
          status: "confirmed",
          date: new Date(Date.now() - 3600000).toISOString(),
          category: "goods",
        },
        {
          id: "TG00000003",
          vehicle: { id: "suv", emoji: "🚙", name: "Premium SUV", image: VEHICLE_IMAGES.suv },
          pickup: "Karol Bagh",
          drop: "Noida Sector 18",
          fare: 890,
          payment: "card",
          status: "cancelled",
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          category: "passenger",
        },
      ];
      setBookings(demo);
    } else {
      setBookings(data);
    }
  }, []);

  const addToast = (type, icon, title, message) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, icon, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const handleCancel = () => {
    const updated = bookings.map((b) =>
      b.id === cancelTarget ? { ...b, status: "cancelled" } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    addToast("info", "ℹ️", "Booking Cancelled", `Booking ${cancelTarget} has been cancelled.`);
    setCancelTarget(null);
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f23" }}>
      <Toast toasts={toasts} />

      <nav className="navbar">
        <button
          onClick={() => navigate("/home")}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}
        >
          ⇦ Home
        </button>
        <div className="nav-logo">TravelGo</div>
        <button className="btn btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }} onClick={() => navigate("/booking")}>
          + New Booking
        </button>
      </nav>

      <div className="bookings-page">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total", count: bookings.length, icon: "📋", color: "#0984e3" },
            { label: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length, icon: "✅", color: "#00b894" },
            { label: "Completed", count: bookings.filter((b) => b.status === "completed").length, icon: "🏁", color: "#a29bfe" },
            { label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length, icon: "❌", color: "#d63031" },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => setFilter(s.label.toLowerCase() === "total" ? "all" : s.label.toLowerCase())}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1.5px solid ${filter === (s.label.toLowerCase() === "total" ? "all" : s.label.toLowerCase()) ? s.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 14, padding: "1rem", cursor: "pointer", transition: "all 0.3s",
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.color, fontFamily: "Poppins" }}>{s.count}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["all", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 1rem", borderRadius: "100px", border: "1.5px solid",
                borderColor: filter === f ? "#e94560" : "rgba(255,255,255,0.1)",
                background: filter === f ? "rgba(233,69,96,0.12)" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#e94560" : "rgba(255,255,255,0.6)",
                fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>No bookings found</div>
            <p style={{ fontSize: "0.9rem" }}>Start your journey by booking a ride!</p>
            <button className="btn btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => navigate("/booking")}>
              Book Now
            </button>
          </div>
        ) : (
          filtered.map((booking) => {
            const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
            return (
              <div key={booking.id} className="booking-item">
                <div className="booking-item-header">
                  <div>
                    <div className="booking-id">#{booking.id}</div>
                    <div className="booking-vehicle-name" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <img
                        src={booking.vehicle?.image || VEHICLE_IMAGES[booking.vehicle?.id] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80"}
                        alt={booking.vehicle?.name || "Vehicle"}
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(15,23,42,0.12)" }}
                        loading="lazy"
                      />
                      <span>{booking.vehicle?.emoji} {booking.vehicle?.name}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem" }}>
                      {booking.category === "goods" ? "📦 Goods" : "🚗 Passenger"} • {booking.payment?.toUpperCase()}
                    </div>
                  </div>
                  <span className={`badge ${cfg.badgeClass}`}>{cfg.icon} {cfg.label}</span>
                </div>

                <div className="booking-route">
                  <span>📍 {booking.pickup}</span>
                  <span className="route-arrow">→</span>
                  <span>📍 {booking.drop}</span>
                </div>

                <div className="booking-item-footer">
                  <div>
                    <div className="booking-amount">₹{booking.fare}</div>
                    <div className="booking-date">{formatDate(booking.date)}</div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {booking.status === "completed" && (
                      <button
                        className="btn"
                        style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem", background: "rgba(253,203,110,0.15)", color: "#fdcb6e", border: "1px solid rgba(253,203,110,0.2)", borderRadius: 8 }}
                        onClick={() => navigate(`/review?id=${booking.id}`)}
                      >
                        ⭐ Review
                      </button>
                    )}
                    {(booking.status === "confirmed" || booking.status === "pending") && (
                      <button
                        className="btn"
                        style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem", background: "rgba(214,48,49,0.12)", color: "#ff7675", border: "1px solid rgba(214,48,49,0.2)", borderRadius: 8 }}
                        onClick={() => setCancelTarget(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="modal-overlay" onClick={() => setCancelTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>⚠️</div>
              <h2 style={{ fontFamily: "Poppins", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Cancel Booking?</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Booking <strong style={{ color: "white" }}>#{cancelTarget}</strong> will be cancelled.
                Cancellation fees may apply based on timing.
              </p>
            </div>
            <div style={{ background: "rgba(214,48,49,0.07)", border: "1px solid rgba(214,48,49,0.15)", borderRadius: 10, padding: "0.8rem 1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
              ⚠️ Free cancellation within 2 minutes of booking. After that, ₹50 cancellation fee applies.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button className="btn btn-outline" style={{ padding: "0.85rem" }} onClick={() => setCancelTarget(null)}>
                Keep Booking
              </button>
              <button className="btn btn-danger" style={{ padding: "0.85rem" }} onClick={handleCancel}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
