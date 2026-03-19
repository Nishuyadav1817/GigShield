import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrImg from './WhatsApp Image 2026-03-20 at 12.20.02 AM.jpeg';

/* Load Razorpay script */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

const RAZORPAY_KEY_ID = "rzp_test_SSkL2ogoBixACZ";

export default function Payment() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  /* Load user */
  useEffect(() => {
    loadRazorpay();

    const stored = localStorage.getItem("user");

    if (!stored) {
      setRedirecting(true);
      setTimeout(() => navigate("/register"), 2500);
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  // Prevent ESLint no-unused-vars error
  if (!user && !redirecting) return null;

  /* Create order + open Razorpay */
  async function handlePayment() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://gig-bima-ovmt.vercel.app/worker/base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            action: "create-order",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create order");

      setStatus("idle");

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GIGBima",
        description: "Basic Plan ₹25/week",
        order_id: data.orderId,
        prefill: {
          name: data.userName,
          email: data.userEmail,
          contact: data.userPhone,
        },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          await verifyPayment(response);
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      rzp.on("payment.failed", (r) => {
        setErrorMsg("Payment failed: " + r.error.description);
        setStatus("error");
      });

      rzp.open();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  /* Verify payment */
  async function verifyPayment(response) {
    setStatus("loading");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://gig-bima-ovmt.vercel.app/worker/base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            action: "verify",
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      const updated = { ...user, plan: "basic" };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);

      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  /* Redirect screen */
  if (redirecting) {
    return (
      <div className="p-page">
        <div className="p-success-box">
          <h2>Login Required</h2>
          <p>Please register or login before purchasing a plan.</p>

          <button onClick={() => navigate("/register")}>
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  /* Success screen */
  if (status === "success") {
    return (
      <div className="p-page">
        <div className="p-success-box">
          <div className="p-check">✓</div>
          <h2>Payment Successful</h2>
          <p>Your Basic Plan is now active.</p>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  /* Main Payment UI */
  return (
    <div className="p-page">
      <div className="p-layout">
        {/* LEFT SIDE */}
        <div className="p-left">
          <div className="p-tag">BASIC PLAN</div>
          <h1 className="p-headline">Protect your income today</h1>
          <p className="p-subtext">
            Affordable protection for gig workers against weather, curfew, strike, and health disruptions.
          </p>
          <div className="p-price">
            ₹499 <span>/ year</span>
          </div>
          <ul className="p-perks">
            <li>₹700/day for weather disruption</li>
            <li>₹700/day for curfew or strike</li>
            <li>₹500/day for health or injury</li>
            <li>24/7 claim support</li>
          </ul>
          <div className="p-user-strip">
            {user?.firstName || user?.FullName} • {user?.emailId || user?.EmailId}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-right">
          {/* QR Payment */}
          <div className="p-qr-block">
            <p>Pay via UPI</p>
            <div className="p-qr-img-wrap">
              <img src={qrImg} alt="UPI QR" />
            </div>
            <div className="p-upi-id">yourupi@razorpay</div>
            <div className="p-apps">GPay • PhonePe • Paytm • BHIM</div>
          </div>

          <div className="p-divider">or</div>

          {/* Error */}
          {status === "error" && <div className="p-error">{errorMsg}</div>}

          {/* Pay Button */}
          <button className="p-pay-btn" onClick={handlePayment} disabled={status === "loading"}>
            {status === "loading" ? "Processing..." : "Pay ₹499"}
          </button>

          <p className="p-secure">Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
}