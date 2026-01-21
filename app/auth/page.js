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
        maxWidth: "500px",
        margin: "3rem auto",
        padding: "25px",
        backgroundColor: "#f0f4f8",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#e74c3c", marginBottom: "25px" }}>
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <label>
          Phone:
          <PhoneInput
            country={"cm"}
            value={user.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
          />
        </label>

        {!isLogin && (
          <label>
            Jurisdiction:
            <input
              type="text"
              name="jurisdiction"
              value={user.jurisdiction}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {message && <p style={{ textAlign: "center", marginTop: 15 }}>{message}</p>}

      <p style={{ textAlign: "center", marginTop: 10 }}>
        {isLogin ? "No account?" : "Already registered?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ color: "#e74c3c" }}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
