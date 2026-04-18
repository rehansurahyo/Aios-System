// src/pages/Login.jsx
import React, { useState } from "react";

const API_BASE = "https://backend-two-orpin-12.vercel.app";

function Login({ theme, onLoginSuccess }) {
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { db } = await import("../config/firebase");
      const { collection, query, where, getDocs } = await import("firebase/firestore");

      // 1. Try finding by "email" (standard)
      let q = query(collection(db, "users"), where("email", "==", email));
      let snapshot = await getDocs(q);

      // 2. If not found, try "Email" (capitalized, for manual user entries)
      if (snapshot.empty) {
        q = query(collection(db, "users"), where("Email", "==", email));
        snapshot = await getDocs(q);
      }

      if (snapshot.empty) {
        throw new Error("Invalid credentials");
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // 3. Check password (standard "password" or manual "Password")
      // Supporting plain text as requested by user
      const storedPass = userData.password || userData.Password;

      if (!storedPass || (storedPass !== password && storedPass.trim() !== password)) {
        throw new Error("Invalid credentials");
      }

      // Login Success!
      const userObj = { id: userDoc.id, ...userData };
      localStorage.setItem("aios_token", "emergency_token_" + Date.now()); // Fake token for client-side valid
      localStorage.setItem("aios_user", JSON.stringify(userObj));
      onLoginSuccess(userObj);

    } catch (err) {
      console.error(err);
      // Simplify error message as requested
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen flex items-center justify-center bg-slate-950 text-slate-50"
          : "min-h-screen flex items-center justify-center bg-slate-50 text-slate-900"
      }
    >
      <div
        className={
          (isDark
            ? "bg-slate-950/90 border-slate-800"
            : "bg-white border-slate-200") +
          " w-full max-w-md rounded-3xl border px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.65)]"
        }
      >
        <p className="tracking-[0.35em] text-[9px] font-semibold text-emerald-400 uppercase">
          AIOS-SYSTEMS
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          <span className={isDark ? "text-slate-50" : "text-slate-900"}>
            Studio
          </span>{" "}
          <span className="text-emerald-400">Dashboard</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage cabins, customers and studio overview.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                (isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-300 text-slate-900") +
                " w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                (isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-300 text-slate-900") +
                " w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              }
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold py-2.5 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
