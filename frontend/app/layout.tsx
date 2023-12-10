import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preference Arcade",
  description:
    "Incorporate human preferences into autonomous agents with online game play.",
  icons: ["/favicon.png"],
};
const Game_Font = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`px-2 ${Game_Font.className} mb-20`}>{children}</body>
    </html>
  );
}
