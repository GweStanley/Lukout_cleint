"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [user, setUser] = useState({ phone: "", password: "", jurisdiction: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (value, country) => {
    setUser({
      ...user,
      phone: `+${value}`,
      jurisdiction: isLogin ? user.jurisdiction : country.name,
    });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const API_BASE = "http://localhost:5000/api/auth";
    const endpoint = isLogin ? "/login" : "/signup";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON server response:", text);
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setMessage(data.message || "Authentication failed");
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      setMessage(isLogin ? "Login successful!" : "Signup successful! Redirecting...");

      setTimeout(() => router.push("/"), 700);
    } catch (err) {
      console.error(err);
      setMessage("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "3rem auto",
        padding: "25px",
        backgroundColor: "#f0f4f8",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#e74c3c",
          marginBottom: "25px",
          fontSize: "1.9rem",
        }}
      >
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <label style={{ fontWeight: "bold", color: "#2c3e50" }}>
          Phone:
          <PhoneInput
            country={"cm"}
            value={user.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%", borderRadius: "8px", padding: "10px 10px 10px 60px" }}
            buttonStyle={{ border: "none", background: "transparent", padding: "0 10px" }}
            enableAreaCodes
            enableTerritories
          />
        </label>

        {!isLogin && (
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>
            Jurisdiction:
            <input
              type="text"
              name="jurisdiction"
              value={user.jurisdiction}
              onChange={handleChange}
              placeholder="City, State, Country"
              style={{
                marginTop: "5px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
              required
            />
          </label>
        )}

        <label style={{ fontWeight: "bold", color: "#2c3e50" }}>
          Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={{
              marginTop: "5px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "100%",
            }}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.8rem 1.2rem",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "progress" : "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1.5rem", color: "#34495e", fontWeight: "bold", textAlign: "center" }}>
          {message}
        </p>
      )}

      <p style={{ textAlign: "center", marginTop: "15px", color: "#555" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "#e74c3c", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
