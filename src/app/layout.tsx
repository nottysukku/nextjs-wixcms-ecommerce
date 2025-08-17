import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import LoadingBar from "@/components/LoadingBar";
import CursorStardust from "@/components/CursorStardust";
import { WixClientContextProvider } from "@/context/wixContext";
import { ThemeProvider } from "@/context/themeContext";
import { LoadingProvider } from "@/context/loadingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nottysukkus E-Commerce Application",
  description: "A custom-built web store using Next.js, connected to Wix for content and product management.",
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 transition-colors duration-300`}>
        <ThemeProvider>
          <WixClientContextProvider>
            <LoadingProvider>
              <CursorStardust />
              <LoadingBar />
              <PageTransition>
                <Navbar />
                <div className="pt-20">
                  {children}
                </div>
                <Footer />
              </PageTransition>
            </LoadingProvider>
          </WixClientContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
