import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "JQ BAGS — Haute Maroquinerie & Accessoires en Perles Fait Main",
  description:
    "Découvrez les sacs de soirée, clutches d'exception, minaudières et porte-clés artisanaux perlés faits main par l'atelier JQ BAGS.",
  keywords: [
    "sacs en perles",
    "porte-clés fait main",
    "artisanat Cameroun",
    "maroquinerie luxe",
    "clutch doré",
    "accessoires perles",
    "JQ BAGS",
  ],
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen flex flex-col bg-obsidian-950 font-sans text-zinc-100">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
