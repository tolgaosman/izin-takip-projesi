import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/auth/auth-provider";
import { AppToastProvider } from "@/components/ui/toast";

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
      className="h-full antialiased ubuntu-light"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AppToastProvider>{children}</AppToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
