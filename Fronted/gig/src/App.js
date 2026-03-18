import React from "react";
import "./App.css";

import { useNavigate } from "react-router-dom";
function App() {

  const navigate = useNavigate();
  return (
    <div className="main">

      {/* NAVBAR */}
      <nav className="navbar glass">
        <div className="logo">🛡️ GIGBima</div>

        <div className="nav-btns">
          <button className="btn-primary">Pay Premium</button>
          <button className="btn-outline" onClick={() => navigate("/register")}>
      Login
    </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero glass">

        <h1>Protect Your Daily Income</h1>
        <p>Earn without fear. Get insured for just ₹25/week</p>

        <div className="search">
          <input placeholder="Select your work type..." />
        </div>

        <button className="cta">Get Your Plan →</button>

        <span className="trust">✨ Trusted by 10,000+ Gig Workers</span>

      </section>

      {/* PLANS */}
      <section className="plans">

        <h2>Choose Your Plan</h2>

        <div className="plan-grid">

          <div className="card glass">
            <h3>BASIC</h3>
            <h1>₹25/week</h1>

            <ul>
              <li>✔ ₹700/day payout</li>
              <li>✔ Weather + Social cover</li>
            </ul>

            <button className="btn-green">Select Plan</button>
          </div>

          <div className="card glass pro">
            <span className="badge">Recommended</span>

            <h3>PRO</h3>
            <h1>₹49/week</h1>

            <ul>
              <li>✔ ₹1000/day payout</li>
              <li>✔ All disruptions covered</li>
            </ul>

            <button className="btn-primary">Select Plan</button>
          </div>

        </div>
      </section>

      {/* COVERAGE */}
      <section className="coverage">
        <h2>What's Covered?</h2>

        <div className="cov-grid">

          <div className="cov-card glass">
            🌧️ <h4>Weather Disruption</h4>
            <p>Heavy rain, heat</p>
            <span>₹700/day</span>
          </div>

          <div className="cov-card glass">
            🚧 <h4>Social Disruption</h4>
            <p>Curfew, strike</p>
            <span>₹700/day</span>
          </div>

          <div className="cov-card glass">
            🩺 <h4>Health Issues</h4>
            <p>Sick or injury</p>
            <span>₹500/day</span>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <div className="claim">
        ⚡ Claim Now
      </div>

    </div>
  );
}

export default App;