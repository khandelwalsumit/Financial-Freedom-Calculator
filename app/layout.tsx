import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Freedom Calculator",
  description: "Dual-scenario simulation engine for loan optimization and wealth building",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
