import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// QuestTrial for body text (using local font with fallback)
// Note: You'll need to add the actual QuestTrial font files to app/fonts/
// For now, using Inter as fallback
const questTrial = Inter({
  variable: "--font-quest-trial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Google Sans for titles, headers, and numbers
// Note: Google Sans is not available on Google Fonts, using Plus Jakarta Sans as similar alternative
// You can replace this with actual Google Sans font files when available
const googleSans = Plus_Jakarta_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Keep existing fonts as fallbacks
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Inspire Admin",
  description: "Inspire Wallet Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${questTrial.variable} ${googleSans.variable} ${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
