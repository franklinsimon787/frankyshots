"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      // Role-based redirect
      if (data.admin?.role === "VICKVERSE_ADMIN") {
        router.push("/admin/vickverse");
      } else {
        router.push("/admin");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-gray-500">
            Frankyshots
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Sign in to manage your website.
          </p>
        </div>

        {/* Login Box */}
        <div className="border border-white/10 bg-neutral-950 p-8">

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@frankyshots.com"
                required
                autoComplete="email"
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-600">
          Frankyshots Administration
        </p>

      </div>
    </main>
  );
}