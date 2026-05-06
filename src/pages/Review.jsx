import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const REVIEW_TAGS = [
  "Great Driver", "Punctual", "Clean Vehicle", "Safe Driving",
  "Friendly", "Smooth Ride", "AC Working", "Good Music",
];

const RECENT_REVIEWS = [
  { name: "Rahul S.", rating: 5, text: "Amazing experience! Driver was very professional and arrived on time.", date: "2 days ago", avatar: "R" },
  { name: "Priya M.", rating: 4, text: "Good ride, comfortable car. Will use again.", date: "1 week ago", avatar: "P" },
  { name: "Amit K.", rating: 5, text: "Best service ever. Highly recommend TravelGo!", date: "2 weeks ago", avatar: "A" },
];

export default function Review() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookingId = params.get("id") || "TG00000001";

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((t) => t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    // Save review
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.unshift({
      bookingId,
      rating,
      tags: selectedTags,
      text: reviewText,
      date: new Date().toISOString(),
    });
    localStorage.setItem("reviews", JSON.stringify(reviews));
    setSubmitted(true);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f23", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🌟</div>
          <h1 style={{ fontFamily: "Poppins", fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Thank You!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Your {rating}-star review has been submitted. Your feedback helps us improve!
          </p>
          <div style={{ display: "flex", justify: "center", gap: "0.4rem", marginBottom: "2rem", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ fontSize: "2rem", color: s <= rating ? "#fdcb6e" : "rgba(255,255,255,0.2)" }}>★</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => navigate("/home")}>Go Home</button>
            <button className="btn btn-outline" onClick={() => navigate("/my-bookings")}>My Bookings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f23" }}>
      <nav className="navbar">
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", cursor: "pointer" }}
        >
          ← Back
        </button>
        <div className="nav-logo">TravelGo</div>
        <div />
      </nav>

      <div className="review-page">
        {/* Driver card */}
        <div className="review-driver-card">
          <div className="driver-avatar">D</div>
          <div className="driver-info">
            <h3>Rajesh Kumar</h3>
            <p>🚗 City Sedan • DL 01 AB 1234</p>
            <p style={{ marginTop: "0.2rem" }}>Booking #{bookingId}</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fdcb6e" }}>4.8 ★</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>1,234 rides</div>
          </div>
        </div>

        {/* Rating */}
        <div className="rating-section">
          <h3>How was your ride?</h3>
          <div className="stars-large" style={{ marginBottom: "0.75rem" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`star-large${s <= (hovered || rating) ? " filled" : ""}`}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
              >
                ★
              </span>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fdcb6e" }}>
              {ratingLabels[hovered || rating]}
            </div>
          )}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem" }}>What went well?</h3>
          <div className="review-tags">
            {REVIEW_TAGS.map((tag) => (
              <button
                key={tag}
                className={`review-tag${selectedTags.includes(tag) ? " selected" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Text review */}
        <div className="input-group" style={{ marginBottom: "1.5rem" }}>
          <label>Write a review (optional)</label>
          <textarea
            className="input-field"
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Submit Review ⭐
        </button>

        {/* Recent reviews */}
        <div style={{ marginTop: "3rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem", color: "rgba(255,255,255,0.7)" }}>
            Recent Reviews for This Driver
          </h3>
          {RECENT_REVIEWS.map((r) => (
            <div key={r.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.1rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#e94560,#f5a623)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                  {r.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{r.date}</div>
                </div>
                <div style={{ color: "#fdcb6e", fontSize: "0.9rem" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
