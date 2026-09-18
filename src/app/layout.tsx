import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif-loaded",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gesto",
  description: "See a motion, then copy it for your page.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
