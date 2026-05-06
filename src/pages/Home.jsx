import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BG_SLIDES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80",
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
];

const VEHICLE_IMAGES = {
  sedan: "https://www.popularmaruti.com/blog/wp-content/uploads/2023/01/avtomobili-suzuki-1115280-scaled.jpg",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80",
  auto: "https://www.rushlane.com/wp-content/uploads/2026/05/New-Force-Traveller-N-Range-2.jpeg",
  luxury: "https://fortune-toyota.com/wp-content/uploads/2025/07/toyota-innova-copy.webp",
  bike: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Wagon-R-tour/9442/1762863641169/front-left-side-47.jpg",
  minibus: "https://www.siddeshwaratravels.in/mini_bus_images/20160602_151559.jpg",
  "mini-truck": "https://truckcdn.cardekho.com/in/tata/ace-gold/tata-ace-gold-87579.jpg?impolicy=resize&imwidth=420",
  tempo: "https://truckcdn.cardekho.com/in/tata/ace-ev/tata-ace-ev-92578.jpg?impolicy=resize&imwidth=420",
  "large-truck": "https://truckcdn.cardekho.com/in/mahindra/bolero-maxx-pik-up-hd/mahindra-bolero-maxx-pik-up-hd-96009.jpg?impolicy=resize&imwidth=480",
  "bike-delivery": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80",
  refrigerated: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
  flatbed: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=900&q=80",
};

const PASSENGER_VEHICLES = [
  {
    id: "swift",
    emoji: "🚗",
    name: "Muruti Swift",
    desc: "Comfortable swift for everyday city travel. AC, clean interiors, professional drivers.",
    features: ["4 Seats", "AC", "GPS Tracked", "Insured"],
    price: "₹12/km",
    base: 80,
    category: "passenger",
    rating: 4.8,
    eta: "3 min",
    image: VEHICLE_IMAGES.sedan,
  },
  {
    id: "suv",
    emoji: "🚙",
    name: "Premium SUV",
    desc: "Spacious SUV for families or group travel. Extra luggage space and premium comfort.",
    features: ["6 Seats", "AC", "Extra Luggage", "Premium"],
    price: "₹18/km",
    base: 120,
    category: "passenger",
    rating: 4.9,
    eta: "5 min",
    image: VEHICLE_IMAGES.suv,
  },
  {
    id: "traveller",
    emoji: "🛺",
    name: "Traveller",
    desc: "Quick and affordable for long distances. Comfort and ease of travel.across cities, ",
    features: ["30 Seats", "Budget", "Long Trip"],
    price: "₹8/km",
    base: 40,
    category: "passenger",
    rating: 4.6,
    eta: "2 min",
    image: VEHICLE_IMAGES.auto,
  },
  {
    id: "Innova  crysta",
    emoji: "🚘",
    name: "Innova Crysta",
    desc: "Travel in style. Premium vehicles for business or special occasions.",
    features: ["8 Seats", "AC", "Wi-Fi", "VIP"],
    price: "₹30/km",
    base: 200,
    category: "passenger",
    rating: 5.0,
    eta: "8 min",
    image: VEHICLE_IMAGES.luxury,
  },
  {
    id: "bike",
    emoji: "🏍️",
    name: "Wagon R",
    desc: "A popular 5-seater tall-boy hatchback  known for its spacious  cabin, practical design, and high fuel efficiency",
    features: ["4 Seat", "Fastest", "Budget"],
    price: "₹5/km",
    base: 30,
    category: "passenger",
    rating: 4.5,
    eta: "1 min",
    image: VEHICLE_IMAGES.bike,
  },
  {
    id: "minibus",
    emoji: "🚐",
    name: "Mini Bus",
    desc: "Group travel made easy. Perfect for offices, events, or school trips.",
    features: ["12 Seats", "AC", "Group Travel"],
    price: "₹25/km",
    base: 300,
    category: "passenger",
    rating: 4.7,
    eta: "10 min",
    image: VEHICLE_IMAGES.minibus,
  },
];

const GOODS_VEHICLES = [
  {
    id: "mini-truck",
    emoji: "🚛",
    name: "Mini Truck",
    desc: "Ideal for small loads, furniture, and household goods. Fits in narrow lanes.",
    features: ["500 kg", "City Delivery", "Loading Help"],
    price: "₹20/km",
    base: 200,
    category: "goods",
    rating: 4.7,
    eta: "12 min",
    image: VEHICLE_IMAGES["mini-truck"],
  },
  {
    id: "tempo",
    emoji: "🚚",
    name: "Tempo / Tata Ace",
    desc: "Most popular choice for small businesses, e-commerce, and market deliveries.",
    features: ["1 Ton", "Business", "Daily Rental"],
    price: "₹15/km",
    base: 150,
    category: "goods",
    rating: 4.6,
    eta: "8 min",
    image: VEHICLE_IMAGES.tempo,
  },
  {
    id: "large-truck",
    emoji: "🏗️",
    name: "Mahindra Pik-Up",
    desc: "Heavy duty transport for industrial goods, machinery, or full household relocation.",
    features: ["5 Tons", "Inter-city", "Crane Available"],
    price: "₹40/km",
    base: 800,
    category: "goods",
    rating: 4.8,
    eta: "20 min",
    image: VEHICLE_IMAGES["large-truck"],
  },
  
  

];  



const FEATURES = [
  { icon: "🛡️", color: "#00b894", title: "Safe & Verified", desc: "All drivers are background checked and verified by our team." },
  { icon: "⚡", color: "#f5a623", title: "Fast Booking", desc: "Book in under 30 seconds. Real-time driver matching technology." },
  { icon: "📍", color: "#e94560", title: "Live Tracking", desc: "Track your ride or delivery in real-time on an interactive map." },
  { icon: "💳", color: "#0984e3", title: "Easy Payment", desc: "Cash, UPI, cards, or wallets — pay any way you prefer." },
  { icon: "🌟", color: "#fdcb6e", title: "Top Rated", desc: "4.9★ average rating from over 50,000 satisfied customers." },
  { icon: "🎧", color: "#a29bfe", title: "24/7 Support", desc: "Round-the-clock customer support to help you anytime." },
];

const STEPS = [
  { n: "1", title: "Choose Vehicle", desc: "Select passenger or goods vehicle that fits your need and budget." },
  { n: "2", title: "Enter Location", desc: "Set your pickup and drop-off points on the interactive map." },
  { n: "3", title: "Confirm & Pay", desc: "Review fare estimate, choose payment method and confirm booking." },
  { n: "4", title: "Track Live", desc: "Track your driver in real-time until arrival at your destination." },
];

function ProfileMenu({ user, navigate }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ position: "relative" }}>
      
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#e94560,#f5a623)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}
        >
          {(user.name || "T")[0].toUpperCase()}
        </div>

        <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
          {user.name || "Traveller"} ⬇
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "45px",
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            width: "160px",
            overflow: "hidden",
            zIndex: 100
          }}
        >
          <button
            style={menuItemStyle}
            onClick={() => navigate("/profile")}
          >
            ⚙ Settings
          </button>

          <button
            style={{ ...menuItemStyle, color: "red" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer"
};


function Navbar({ navigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">TravelGo</div>

      {/* ☰ Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu (ONLY settings + logout) */}
  {menuOpen && (
  <div className="mobile-menu">
    
    <button
      onClick={() => {
        navigate("/profile");
        setMenuOpen(false);
      }}
    >
      ⚙ Settings
    </button>

    {/* 👇 Divider line */}
    <div className="menu-divider"></div>

    <button
      onClick={handleLogout}
      style={{ color: "red" }}
    >
      ➜] Logout
    </button>

  </div>
)}
    </nav>
  );
}

function VehicleCard({ vehicle, onBook }) {
  return (
    <div className="vehicle-card" onClick={() => onBook(vehicle)}>
      <div className="vehicle-card-img">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      <div className="vehicle-card-body">
        <div className="vehicle-card-top">
          <span className="vehicle-name">{vehicle.name}</span>
          <span className="vehicle-price">{vehicle.price}</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
          <span>⭐ {vehicle.rating}</span>
          <span>•</span>
          <span>🕐 {vehicle.eta}</span>
          <span>•</span>
          <span>Base ₹{vehicle.base}</span>
        </div>
        <p className="vehicle-desc">{vehicle.desc}</p>
        <div className="vehicle-features">
          {vehicle.features.map((f) => (
            <span key={f} className="feature-chip">✓ {f}</span>
          ))}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "0.65rem" }}>
          Book Now →
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [category, setCategory] = useState("passenger");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BG_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleBook = (vehicle) => {
    navigate("/booking", { state: { vehicle, pickup, drop } });
  };

  const vehicles = category === "passenger" ? PASSENGER_VEHICLES : GOODS_VEHICLES;

  return (
    <div className="app-container">
      <Navbar navigate={navigate} />

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-bg-slider">
          {BG_SLIDES.map((src, i) => (
            <div
              key={i}
              className={`hero-bg-slide${i === slide ? " active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="container" style={{ width: "100%", paddingTop: "4rem" }}>
          <div className="hero-content">
            <div className="hero-badge">🚀 #1 Travel App in India</div>
            <h1 className="hero-title">
              Go Anywhere,<br />
              <span className="gradient-text">Deliver Everything</span>
            </h1>
            <p className="hero-desc">
              Book passenger rides or schedule goods transport in seconds. 
              Safe, reliable and affordable travel solutions at your fingertips.
            </p>

            {/* Quick book widget */}
            <div className="quick-book">
              <h3> Request a ride for now
              </h3>
              <div className="quick-book-grid">
                <input
                  className="input-field"
                  placeholder="📍 Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="📍 Drop location"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => { setCategory("passenger"); document.getElementById("vehicles").scrollIntoView({ behavior: "smooth" }); }}
                >
                   Book a Ride
                </button>
                <button
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                  onClick={() => { setCategory("goods"); document.getElementById("vehicles").scrollIntoView({ behavior: "smooth" }); }}
                >
                   Send Goods
                </button>
              </div>
            </div>

            <div className="hero-stats">
              {[
                { n: "50K+", l: "Happy Customers" },
                { n: "1,200+", l: "Verified Drivers" },
                { n: "30+", l: "Cities Covered" },
                { n: "4.9★", l: "Avg Rating" },
              ].map((s) => (
                <div key={s.l} className="stat-item">
                  <span className="stat-number">{s.n}</span>
                  <span className="stat-label">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 2 }}>
          {BG_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? "#e94560" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s" }}
            />
          ))}
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="section" id="vehicles">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Fleet</div>
            <h2 className="section-title">Choose Your Vehicle</h2>
            <p className="section-desc">
              From budget rides to luxury travel, from parcels to heavy goods — we have the perfect vehicle for every need.
            </p>
          </div>

          <div className="category-tabs">
            <button className={`cat-tab${category === "passenger" ? " active" : ""}`} onClick={() => setCategory("passenger")}>
               Passenger Vehicles
            </button>
            <button className={`cat-tab${category === "goods" ? " active" : ""}`} onClick={() => setCategory("goods")}>
               Goods Vehicles
            </button>
          </div>

         
          <div className="vehicles-grid">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onBook={handleBook} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Why TravelGo</div>
            <h2 className="section-title">Built for Your Journey</h2>
            <p className="section-desc">Every feature designed to make your travel experience seamless and safe.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.color + "22" }}>
                  <span>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Simple Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Get started in 4 easy steps. Book a ride or send a package in under a minute.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ background: "linear-gradient(135deg, rgba(233,69,96,0.15), rgba(245,166,35,0.1))", border: "1px solid rgba(233,69,96,0.2)", borderRadius: 24, padding: "3rem 2rem", textAlign: "center" }}>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, marginBottom: "1rem" }}>
              Ready for Your Next Journey?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
              Join thousands of happy travellers. Fast, safe, and affordable — book your ride now.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }} onClick={() => navigate("/booking")}>
                Book a Ride Now
              </button>
              <button className="btn btn-outline" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }} onClick={() => navigate("/my-bookings")}>
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo" style={{ fontSize: "1.6rem" }}>TravelGo</div>
              <p>Your trusted travel and logistics partner. Safe, reliable, affordable — available 24/7 across 30+ cities.</p>
            </div>
            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><a href="#">City Rides</a></li>
                <li><a href="#">Goods Transport</a></li>
                <li><a href="#">Parcel Delivery</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
              
               
              </ul>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TravelGo. All rights reserved.</span>
            <span style={{ display: "flex", gap: "1rem" }}>
              <a href="#">🐦 Twitter</a>
              <a href="#">📸 Instagram</a>
              <a href="#">💼 LinkedIn</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
