import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const DEFAULT_MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=72.77%2C18.89%2C72.95%2C19.12&layer=mapnik";

const buildPlaceSearchUrl = (query) =>
  `${NOMINATIM_BASE}/search?format=jsonv2&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`;

const buildReverseLookupUrl = (lat, lon) =>
  `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

const buildMapEmbedUrl = (pickupCoords, dropCoords) => {
  if (!pickupCoords && !dropCoords) return DEFAULT_MAP_EMBED;

  const points = [pickupCoords, dropCoords].filter(Boolean);
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const padding = 0.04;
  const minLat = Math.min(...lats) - padding;
  const maxLat = Math.max(...lats) + padding;
  const minLon = Math.min(...lons) - padding;
  const maxLon = Math.max(...lons) + padding;

  const marker = pickupCoords || dropCoords;
  const markerPart = marker ? `&marker=${marker.lat}%2C${marker.lon}` : "";

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik${markerPart}`;
};

const VEHICLES_BY_CATEGORY = {
  passenger: [
    { id: "sedan", emoji: "🚗", name: "Muruti Swift", detail: "4 seats • AC • GPS", price: 350, perKm: 12, image: "https://www.popularmaruti.com/blog/wp-content/uploads/2023/01/avtomobili-suzuki-1115280-scaled.jpg" },
    { id: "suv", emoji: "🚙", name: "Premium SUV", detail: "6 seats • AC • Premium", price: 600, perKm: 18, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80" },
    { id: "auto", emoji: "🛺", name: "Innova  crysta", detail: "7 seats • Budget", price: 1200, perKm: 8, image: "https://fortune-toyota.com/wp-content/uploads/2025/07/toyota-innova-copy.webp" },
    { id: "luxury", emoji: "🚘", name: "Wagon R", detail: "4 seats • Wi-Fi • VIP", price: 300, perKm: 30, image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Wagon-R-tour/9442/1762863641169/front-left-side-47.jpg" },
  ],
  goods: [
    { id: "mini-truck", emoji: "🚛", name: "Mini Truck", detail: "500 kg • City", price: 500, perKm: 20, image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80" },
    { id: "tempo", emoji: "🚚", name: "Tempo / Ace", detail: "1 Ton • Business", price: 400, perKm: 15, image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&q=80" },
    { id: "large-truck", emoji: "🏗️", name: "Large Truck", detail: "5 Tons • Intercity", price: 1500, perKm: 40, image: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=900&q=80" },
   
  ],
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

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming = location.state || {};

  const [pickup, setPickup] = useState(incoming.pickup || "");
  const [drop, setDrop] = useState(incoming.drop || "");
  const [category, setCategory] = useState(incoming.vehicle?.category || "passenger");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [step, setStep] = useState(1); // 1=select, 2=confirm, 3=payment, 4=tracking
  const [toasts, setToasts] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [eta, setEta] = useState(0);
  const [bookingId, setBookingId] = useState("");
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState({ pickup: false, drop: false });

  const vehicles = VEHICLES_BY_CATEGORY[category] || [];

  useEffect(() => {
    if (incoming.vehicle) {
      const match = vehicles.find((v) => v.id === incoming.vehicle.id) || vehicles[0];
      setSelectedVehicle(match);
    }
  }, [category]);

  useEffect(() => {
    const runSearch = async () => {
      if (activeField !== "pickup" || pickup.trim().length < 3) {
        if (activeField === "pickup") setPickupSuggestions([]);
        return;
      }
      try {
        setSuggestionLoading((prev) => ({ ...prev, pickup: true }));
        const response = await fetch(buildPlaceSearchUrl(pickup.trim()), {
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        setPickupSuggestions(
          (Array.isArray(data) ? data : []).map((item) => ({
            label: item.display_name,
            lat: Number(item.lat),
            lon: Number(item.lon),
          }))
        );
      } catch {
        setPickupSuggestions([]);
      } finally {
        setSuggestionLoading((prev) => ({ ...prev, pickup: false }));
      }
    };

    const timer = setTimeout(runSearch, 320);
    return () => clearTimeout(timer);
  }, [pickup, activeField]);

  useEffect(() => {
    const runSearch = async () => {
      if (activeField !== "drop" || drop.trim().length < 3) {
        if (activeField === "drop") setDropSuggestions([]);
        return;
      }
      try {
        setSuggestionLoading((prev) => ({ ...prev, drop: true }));
        const response = await fetch(buildPlaceSearchUrl(drop.trim()), {
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        setDropSuggestions(
          (Array.isArray(data) ? data : []).map((item) => ({
            label: item.display_name,
            lat: Number(item.lat),
            lon: Number(item.lon),
          }))
        );
      } catch {
        setDropSuggestions([]);
      } finally {
        setSuggestionLoading((prev) => ({ ...prev, drop: false }));
      }
    };

    const timer = setTimeout(runSearch, 320);
    return () => clearTimeout(timer);
  }, [drop, activeField]);

  const addToast = (type, icon, title, message) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, icon, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const estimatedFare = () => {
    if (!selectedVehicle) return 0;
    const km = 8; // mock
    return selectedVehicle.price + km * selectedVehicle.perKm;
  };

  const handleConfirmBooking = () => {
    if (!pickup || !drop) {
      addToast("warning", "⚠️", "Missing Locations", "Please enter pickup and drop locations.");
      return;
    }
    if (!selectedVehicle) {
      addToast("warning", "⚠️", "Select Vehicle", "Please select a vehicle to continue.");
      return;
    }
    setStep(2);
  };

  const handleContinueToVehicles = () => {
    if (!pickup || !drop) {
      addToast("warning", "⚠️", "Missing Locations", "Please enter pickup and drop locations.");
      return;
    }
    setShowVehicleList(true);
  };

  const handlePayAndBook = () => {
    const id = "TG" + Date.now().toString().slice(-8);
    setBookingId(id);
    const etaMin = Math.floor(Math.random() * 8) + 3;
    setEta(etaMin);

    const booking = {
      id,
      vehicle: selectedVehicle,
      pickup,
      drop,
      fare: estimatedFare(),
      payment: paymentMethod,
      status: "confirmed",
      date: new Date().toISOString(),
      category,
    };

    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([booking, ...existing]));

    addToast("success", "✅", "Booking Confirmed!", `Driver arriving in ${etaMin} mins. ID: ${id}`);
    setStep(4);
  };

  const handleCancelBooking = () => {
    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updated = existing.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updated));
    addToast("info", "ℹ️", "Booking Cancelled", "Your booking has been cancelled successfully.");
    setShowCancelModal(false);
    setTimeout(() => navigate("/my-bookings"), 1500);
  };

  const applyLocation = (field, suggestion) => {
    if (field === "pickup") {
      setPickup(suggestion.label);
      setPickupCoords({ lat: suggestion.lat, lon: suggestion.lon });
      setPickupSuggestions([]);
    } else {
      setDrop(suggestion.label);
      setDropCoords({ lat: suggestion.lat, lon: suggestion.lon });
      setDropSuggestions([]);
    }
    setActiveField("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast("warning", "⚠️", "GPS Not Supported", "Your browser does not support geolocation.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = Number(coords.latitude.toFixed(6));
        const lon = Number(coords.longitude.toFixed(6));
        setPickupCoords({ lat, lon });
        try {
          const response = await fetch(buildReverseLookupUrl(lat, lon), {
            headers: { Accept: "application/json" },
          });
          const data = await response.json();
          setPickup(data?.display_name || `${lat}, ${lon}`);
          addToast("success", "📍", "Pickup Set", "Current GPS location added as pickup.");
        } catch {
          setPickup(`${lat}, ${lon}`);
          addToast("info", "📍", "GPS Coordinates Added", "Could not resolve full address, coordinates saved.");
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        addToast("warning", "⚠️", "GPS Permission Needed", "Please allow location permission to autofill pickup.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mapEmbedUrl = buildMapEmbedUrl(pickupCoords, dropCoords);

  return (
    <div className="booking-page">
      <Toast toasts={toasts} />

      {/* Navbar */}
      <nav className="navbar">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("/home"))}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}
        >
          ← {step > 1 ? "Back" : "Home"}
        </button>
        <div className="nav-logo">TravelGo</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                width: 28, height: 6, borderRadius: 3,
                background: s <= step ? "linear-gradient(135deg,#e94560,#f5a623)" : "rgba(255,255,255,0.15)",
                transition: "all 0.4s",
              }}
            />
          ))}
        </div>
      </nav>

      <div className="booking-layout">
        {/* Map */}
        <div className={`booking-map${step === 1 && !showVehicleList ? " mobile-hide-map" : ""}`}>
          <iframe
            title="TravelGo live map"
            src={mapEmbedUrl}
            className="booking-map-frame"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-placeholder">
            {step === 4 ? (
              <>
                <div className="map-icon">🚗</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "white", marginBottom: "0.5rem" }}>Driver En Route</div>
                <div style={{ color: "#00b894", fontSize: "1.4rem", fontWeight: 700 }}>{eta} min away</div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Booking ID: {bookingId}</div>
              </>
            ) : (
              <>
                <div className="map-icon">🗺️</div>
                <p>Live OpenStreetMap view</p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
                  Search pickup/drop to update map
                </p>
              </>
            )}
          </div>
        </div>

        {/* Panel */}
        <div className="booking-panel">
          {/* Step 1: Select vehicle */}
          {step === 1 && (
            <>
              {/* Category */}
              <div className="booking-card">
                <h3>Category</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["passenger", "goods"].map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setSelectedVehicle(null); }}
                      style={{
                        flex: 1, padding: "0.6rem", borderRadius: 10, border: "1.5px solid",
                        borderColor: category === c ? "#e94560" : "rgba(255,255,255,0.1)",
                        background: category === c ? "rgba(233,69,96,0.1)" : "rgba(255,255,255,0.04)",
                        color: category === c ? "#e94560" : "rgba(255,255,255,0.6)",
                        fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {c === "passenger" ? "🚗 Passenger" : "📦 Goods"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="booking-card">
                <h3>Route</h3>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: "100%", marginBottom: "0.75rem", padding: "0.7rem" }}
                  onClick={handleUseCurrentLocation}
                  disabled={gpsLoading}
                >
                  {gpsLoading ? "Locating..." : "Use Current GPS Location for Pickup"}
                </button>
                <div className="location-inputs">
                  <div className="location-input-row">
                    <span className="location-dot pickup" />
                    <input
                      placeholder="Pickup location"
                      value={pickup}
                      onFocus={() => setActiveField("pickup")}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        setPickupCoords(null);
                        setActiveField("pickup");
                      }}
                    />
                  </div>
                  {activeField === "pickup" && (
                    <div className="location-suggestion-list">
                      {suggestionLoading.pickup && <div className="location-suggestion-item">Searching...</div>}
                      {!suggestionLoading.pickup &&
                        pickupSuggestions.map((s) => (
                          <button
                            type="button"
                            key={`${s.lat}-${s.lon}`}
                            className="location-suggestion-item"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyLocation("pickup", s)}
                          >
                            {s.label}
                          </button>
                        ))}
                      {!suggestionLoading.pickup && pickup.trim().length >= 3 && pickupSuggestions.length === 0 && (
                        <div className="location-suggestion-item">No matches found</div>
                      )}
                    </div>
                  )}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 1.5rem" }} />
                  <div className="location-input-row">
                    <span className="location-dot drop" />
                    <input
                      placeholder="Drop location"
                      value={drop}
                      onFocus={() => setActiveField("drop")}
                      onChange={(e) => {
                        setDrop(e.target.value);
                        setDropCoords(null);
                        setActiveField("drop");
                      }}
                    />
                  </div>
                  {activeField === "drop" && (
                    <div className="location-suggestion-list">
                      {suggestionLoading.drop && <div className="location-suggestion-item">Searching...</div>}
                      {!suggestionLoading.drop &&
                        dropSuggestions.map((s) => (
                          <button
                            type="button"
                            key={`${s.lat}-${s.lon}`}
                            className="location-suggestion-item"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyLocation("drop", s)}
                          >
                            {s.label}
                          </button>
                        ))}
                      {!suggestionLoading.drop && drop.trim().length >= 3 && dropSuggestions.length === 0 && (
                        <div className="location-suggestion-item">No matches found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!showVehicleList && (
                <button
                  className="btn btn-primary booking-mobile-next-btn"
                  style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
                  onClick={handleContinueToVehicles}
                >
                  Continue to Vehicle List →
                </button>
              )}

              {/* Vehicle options */}
              <div className={`booking-card${!showVehicleList ? " booking-mobile-hide-vehicles" : ""}`}>
                <h3>Select Vehicle</h3>
                <div className="vehicle-options">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      className={`vehicle-option${selectedVehicle?.id === v.id ? " selected" : ""}`}
                      onClick={() => setSelectedVehicle(v)}
                    >
                      <img
                        src={v.image}
                        alt={v.name}
                        style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(15,23,42,0.12)" }}
                        loading="lazy"
                      />
                      <div className="vehicle-option-info">
                        <div className="vehicle-option-name">{v.name}</div>
                        <div className="vehicle-option-detail">{v.detail}</div>
                      </div>
                      <div className="vehicle-option-price">
                        ₹{v.price}
                        <span>Base fare</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`btn btn-primary${!showVehicleList ? " booking-mobile-hide-vehicles" : ""}`}
                style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
                onClick={handleConfirmBooking}
              >
                Review Booking →
              </button>
            </>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && selectedVehicle && (
            <>
              <div className="booking-card">
                <h3>Trip Summary</h3>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem", padding: "1rem", background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
                  <img
                    src={selectedVehicle.image}
                    alt={selectedVehicle.name}
                    style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(15,23,42,0.12)" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>{selectedVehicle.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>{selectedVehicle.detail}</div>
                  </div>
                </div>

                <div className="booking-route">
                  <span>📍 {pickup}</span>
                  <span className="route-arrow">→</span>
                  <span>📍 {drop}</span>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  {[
                    ["Base Fare", `₹${selectedVehicle.price}`],
                    ["Distance (est. 8 km)", `₹${8 * selectedVehicle.perKm}`],
                    ["Platform Fee", "₹25"],
                    ["GST (5%)", `₹${Math.round(estimatedFare() * 0.05)}`],
                  ].map(([label, val]) => (
                    <div key={label} className="fare-row">
                      <span>{label}</span><span>{val}</span>
                    </div>
                  ))}
                  <div className="fare-row total">
                    <span>Total</span>
                    <span>₹{estimatedFare() + 25 + Math.round(estimatedFare() * 0.05)}</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1rem" }} onClick={() => setStep(3)}>
                Proceed to Payment →
              </button>
              <button className="btn btn-outline" style={{ width: "100%", padding: "0.8rem" }} onClick={() => setStep(1)}>
                ← Change Vehicle
              </button>
            </>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <>
              <div className="booking-card">
                <h3>Payment Method</h3>
                <div className="payment-methods" style={{ gap: "0.6rem" }}>
                  {[
                    { id: "upi", icon: "💳", name: "UPI / GPay / PhonePe", desc: "Instant payment" },
                    { id: "card", icon: "🏦", name: "Credit / Debit Card", desc: "All major cards accepted" },
                    { id: "cash", icon: "💵", name: "Cash", desc: "Pay the driver directly" },
                    { id: "wallet", icon: "👛", name: "TravelGo Wallet", desc: "Balance: ₹0.00" },
                  ].map((m) => (
                    <div
                      key={m.id}
                      className={`payment-method${paymentMethod === m.id ? " selected" : ""}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <span className="payment-method-icon">{m.icon}</span>
                      <div>
                        <div className="payment-method-name">{m.name}</div>
                        <div className="payment-method-desc">{m.desc}</div>
                      </div>
                      {paymentMethod === m.id && <span style={{ marginLeft: "auto", color: "#e94560" }}>✓</span>}
                    </div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="card-form">
                    <div className="input-group">
                      <label>Card Number</label>
                      <input className="input-field" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="card-form-row">
                      <div className="input-group">
                        <label>Expiry</label>
                        <input className="input-field" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="input-group">
                        <label>CVV</label>
                        <input className="input-field" placeholder="•••" maxLength={3} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div style={{ padding: "1rem", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginTop: "0.75rem" }}>
                    <div className="input-group">
                      <label>UPI ID</label>
                      <input className="input-field" placeholder="yourname@upi" />
                    </div>
                  </div>
                )}
              </div>

              <div className="secure-badge">
                🔒 Secured by 256-bit SSL encryption
              </div>

              <button className="btn btn-success" style={{ width: "100%", padding: "1rem", fontSize: "1rem" }} onClick={handlePayAndBook}>
                ✅ Confirm & Pay ₹{estimatedFare() + 25 + Math.round(estimatedFare() * 0.05)}
              </button>
            </>
          )}

          {/* Step 4: Tracking */}
          {step === 4 && (
            <>
              <div className="booking-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🎉</div>
                <h3 style={{ textTransform: "none", color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Booking Confirmed!</h3>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>ID: {bookingId}</div>

                <div style={{ background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.2)", borderRadius: 14, padding: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.3rem" }}>Driver arriving in</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "#00b894", fontFamily: "Poppins" }}>{eta} min</div>
                </div>

                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, textAlign: "left" }}>
                  <div>🚗 <strong>Vehicle:</strong> {selectedVehicle?.name}</div>
                  <div>📍 <strong>From:</strong> {pickup}</div>
                  <div>📍 <strong>To:</strong> {drop}</div>
                  <div>💳 <strong>Payment:</strong> {paymentMethod.toUpperCase()}</div>
                  <div>💰 <strong>Fare:</strong> ₹{estimatedFare() + 25 + Math.round(estimatedFare() * 0.05)}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button className="btn btn-primary" style={{ padding: "0.9rem" }} onClick={() => navigate("/my-bookings")}>
                  View My Bookings
                </button>
                <button className="btn btn-outline" style={{ padding: "0.8rem" }} onClick={() => navigate(`/review?id=${bookingId}`)}>
                  Rate This Ride
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: "0.8rem" }}
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>⚠️</div>
              <h2 style={{ fontFamily: "Poppins", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Cancel Booking?</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Are you sure you want to cancel booking <strong style={{ color: "white" }}>{bookingId}</strong>?
                A cancellation fee may apply.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button className="btn btn-outline" style={{ padding: "0.85rem" }} onClick={() => setShowCancelModal(false)}>
                Keep Booking
              </button>
              <button className="btn btn-danger" style={{ padding: "0.85rem" }} onClick={handleCancelBooking}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
