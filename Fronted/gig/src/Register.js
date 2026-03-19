
import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
   FullName: "",
   EmailId: "",
  password: "",
  Address: "",
  platform: "",
  Phonenumber: "",
  Age: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Register Function
  const registerUser = async () => {
    try {
      const response = await fetch("https://gig-bima-ovmt.vercel.app/worker/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      alert(data.message || "Registered Successfully");
      
      if (data.token) {

        localStorage.setItem("token", data.token);
        console.log(data.token);
      }
       if (response.ok) {
      navigate("/");  
    }

    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  // Login Function
  const loginUser = async () => {
    try {
      const response = await fetch("https://gig-bima-ovmt.vercel.app/worker/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
       body: JSON.stringify({
       EmailId: form.EmailId,
       password: form.password
})
      });

      const data = await response.json();
      alert(data.message || "Login Successful");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="gigshield-main">
      <div className="gigshield-card">

        <h1 className="gigshield-title">GigShield</h1>

        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <>
            <input
            type="text"
            name="FullName"
            placeholder="FullName"
            onChange={handleChange}
            />

            <input
              type="text"
              name="Address"
              placeholder="Address"
              onChange={handleChange}
            />

            <input
              type="text"
              name="platform"
              placeholder="Platform (e.g. Fiverr, Upwork)"
              onChange={handleChange}
            />

            <input
              type="tel"
              name="Phonenumber"
              placeholder="Phone Number"
              onChange={handleChange}
            />
          </>
        )}

        <input
           type="email"
          name="EmailId"
         placeholder="Email"
         onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          type="number"
          name="Age"
          placeholder="Age"
          onChange={handleChange}
        />

        <button onClick={isLogin ? loginUser : registerUser}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="gigshield-toggle"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}

export default Register;

