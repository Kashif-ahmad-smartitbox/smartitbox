import { Outfit } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import ClientTopLoader from "./components/ClientTopLoader";
import { AuthProvider } from "@/services/context/AuthContext";
import { AlertProvider } from "@/components/alerts/AlertProvider";
import { GoogleTags, GoogleTagsNoscript } from "./components/GoogleTags";
import { GlobalModalProvider } from "@/components/global/GlobalModalProvider";
import { Metadata } from "next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart ITBox",
  description: "Smart IT Box",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTags />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M499M7HP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <ClientTopLoader />

        <AuthProvider>
          <GlobalModalProvider>
            <AlertProvider>{children}</AlertProvider>
          </GlobalModalProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
