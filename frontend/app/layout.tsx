import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

export const Legible_Font = Inter({ style: "normal", subsets: ["latin"] });
export const Game_Font = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RLHF in the Browser",
  description: "A browser-based version of reinforcement with human feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={Game_Font.className}>{children}</body>
    </html>
  );
}
