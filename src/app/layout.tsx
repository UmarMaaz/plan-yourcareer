import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  IBM_Plex_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan Your Career - Professional Resume Builder",
  description: "Create a job-winning resume in minutes with Plan Your Career.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${inter.variable} 
          ${ibmPlexMono.variable} 
          ${playfairDisplay.variable} 
          antialiased
        `}
      >
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
