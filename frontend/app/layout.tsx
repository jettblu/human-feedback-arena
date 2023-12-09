import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preference Arcade",
  description:
    "Incorporate human preferences into autonomous agents with online game play.",
  icons: ["/favicon.png"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Game_Font = Press_Start_2P({ weight: "400", subsets: ["latin"] });
  return (
    <html lang="en">
      <body className={Game_Font.className}>{children}</body>
    </html>
  );
}
