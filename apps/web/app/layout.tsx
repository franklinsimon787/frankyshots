import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Frankyshots",
  description: "Wildlife • Conservation • Documentary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        {/* Website Visit Tracking */}
        <Script
          id="website-visit-tracking"
          strategy="afterInteractive"
        >
          {`
            fetch("/api/visits", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                path: window.location.pathname
              })
            }).catch(() => {});
          `}
        </Script>
      </body>
    </html>
  );
}