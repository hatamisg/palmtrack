import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Sawit Saku - Manajemen Kebun",
  description: "Aplikasi manajemen kebun kelapa sawit",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sawit Saku",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Sawit Saku",
    title: "Sawit Saku - Manajemen Kebun",
    description: "Aplikasi manajemen kebun kelapa sawit",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress ethereum wallet errors
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = function(...args) {
                  if (args[0]?.toString().includes('ethereum')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </div>
          <OfflineIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
