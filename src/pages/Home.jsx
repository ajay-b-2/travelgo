import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="navbar">
        <h2>TravelGo</h2>
        <button onClick={() => navigate("/")}>Logout</button>
      </header>

      <div className="home-content">
        <h1>Select Your Ride 🚗</h1>

        <div className="vehicle-grid">
          <div className="card">
            <h3>🚕 Taxi</h3>
            <p>Fast & affordable</p>
            <button>Book</button>
          </div>

          <div className="card">
            <h3>🚚 Goods</h3>
            <p>Move items easily</p>
            <button>Book</button>
          </div>

          <div className="card">
            <h3>🚌 Traveller</h3>
            <p>Group trips made easy</p>
            <button>Book</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;