"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [PhoneInput, setPhoneInput] = useState(null);

  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    phone: "",
    password: "",
    jurisdiction: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ Load phone input ONLY in browser */
  useEffect(() => {
    setMounted(true);
    import("react-phone-input-2").then((mod) => {
      setPhoneInput(() => mod.default);
    });
  }, []);

  const handlePhoneChange = (value, country) => {
    setUser((prev) => ({
      ...prev,
      phone: `+${value}`,
      jurisdiction: isLogin ? prev.jurisdiction : country?.name || "",
    }));
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;
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

      if (data.token) localStorage.setItem("token", data.token);
      router.push("/");
    } catch {
      setMessage("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  /* 🚫 Prevent SSR render entirely */
  if (!mounted || !PhoneInput) return null;

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>{isLogin ? "Login" : "Create Account"}</h2>

        <form onSubmit={handleSubmit} style={form}>
          <div>
            <label style={label}>Phone Number</label>
            <PhoneInput
              country="cm"
              value={user.phone}
              onChange={handlePhoneChange}
              inputStyle={input}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={label}>Jurisdiction</label>
              <input
                name="jurisdiction"
                value={user.jurisdiction}
                onChange={handleChange}
                required
                style={input}
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
              required
              style={input}
            />
          </div>

          <button disabled={loading} style={button}>
            {loading ? "Please wait…" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p style={messageStyle}>{message}</p>}

        <p style={switchText}>
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} style={switchBtn}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f2f6fc",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
};

const title = {
  textAlign: "center",
  color: "#e74c3c",
  marginBottom: "25px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const label = {
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  marginTop: "10px",
  padding: "12px",
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const messageStyle = {
  marginTop: "15px",
  textAlign: "center",
  color: "#c0392b",
};

const switchText = {
  textAlign: "center",
  marginTop: "20px",
};

const switchBtn = {
  background: "none",
  border: "none",
  color: "#e74c3c",
  fontWeight: "600",
  cursor: "pointer",
};
