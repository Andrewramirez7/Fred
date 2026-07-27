import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ninja Tamagotchi",
  description: "A tiny ninja pet you can chat with — summoned in a puff of smoke, ready for training.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-pixel">{children}</body>
    </html>
  );
}
