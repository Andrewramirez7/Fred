import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chip | Your Tamagotchi",
  description: "A tiny digital pet you can chat with.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-pixel">{children}</body>
    </html>
  );
}
