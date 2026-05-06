import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="container">
      <div className="overlay"></div>

      <div className={`auth-box ${isLogin ? "" : "signup-mode"}`}>
        <h1>TravelGo</h1>
        <p>{isLogin ? "Welcome back 👋" : "Create your account ✨"}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" required />
          )}

          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {!isLogin && (
            <input type="password" placeholder="Confirm Password" required />
          )}

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;