import type { Metadata } from "next";
import { Hanken_Grotesk, Literata, Space_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/auth/auth-provider";
import { AppToastProvider } from "@/components/ui/toast";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "İzin Takip Sistemi",
  description: "İzin Takip Sistemi",
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, type: "image/x-icon" },
      { url: `${basePath}/assets/browserLogo.png`, type: "image/png" },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/assets/browserLogo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${hankenGrotesk.variable} ${literata.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AppToastProvider>{children}</AppToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
