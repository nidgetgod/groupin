import type { Metadata, Viewport } from "next"; // Import Viewport
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// PWA specific metadata
const APP_NAME = "Community Buys";
const APP_DESCRIPTION = "Join group buys and save money!";
const APP_THEME_COLOR = "#4A90E2"; // Matching manifest.json theme_color

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s - " + APP_NAME,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json", // Link to manifest
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
    // startUpImage: [], // Can add startup images here
  },
  formatDetection: {
    telephone: false,
  },
  // openGraph and twitter metadata can also be added here for better sharing
};

// Viewport settings for PWA
export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* theme-color meta tag is now handled by viewport export above */}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
