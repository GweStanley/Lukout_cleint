"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({ phone: "", password: "", jurisdiction: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

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

    const endpoint = isLogin ? "/login" : "/signup";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Authentication failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

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
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#e74c3c",
          marginBottom: "8px",
          fontSize: "1.9rem",
          fontWeight: 700,
        }}
      >
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#777",
          fontSize: "0.95rem",
          marginBottom: "28px",
        }}
      >
        {isLogin
          ? "Login to continue receiving local alerts"
          : "Sign up to receive real-time emergency alerts"}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <div>
          <label style={label}>Phone Number</label>
          <PhoneInput
            country={"cm"}
            value={user.phone}
            onChange={handlePhoneChange}
            inputStyle={input}
            buttonStyle={{ border: "none", background: "transparent" }}
          />
        </div>

        {!isLogin && (
          <div>
            <label style={label}>Jurisdiction</label>
            <input
              type="text"
              name="jurisdiction"
              value={user.jurisdiction}
              onChange={handleChange}
              placeholder="City, State, Country"
              style={input}
              required
            />
          </div>
        )}

        <div>
          <label style={label}>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "14px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "progress" : "pointer",
            transition: "0.2s",
          }}
        >
          {loading
            ? "Please wait…"
            : isLogin
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontWeight: 500,
            color: message.toLowerCase().includes("error") ? "#e74c3c" : "#27ae60",
          }}
        >
          {message}
        </p>
      )}

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <span style={{ color: "#555" }}>
          {isLogin ? "New here?" : "Already have an account?"}
        </span>{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "#e74c3c",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </div>
    </div>
  </div>
);

}
