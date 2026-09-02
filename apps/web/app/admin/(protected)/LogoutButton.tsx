"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("ADMIN LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      style={{
        padding: "10px 16px",
        borderRadius: "7px",
        border: "1px solid #292929",
        background: "#090909",
        color: loggingOut ? "#555" : "#aaa",
        cursor: loggingOut ? "not-allowed" : "pointer",
        fontSize: "13px",
      }}
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}