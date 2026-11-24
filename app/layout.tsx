import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import { FaviconSync } from "@/components/common/FaviconSync";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let siteIcon = "/images/logo.png";
  try {
    const iconSetting = await prisma.setting.findUnique({
      where: { key: "site_icon" },
    });
    if (iconSetting?.value) {
      siteIcon = iconSetting.value;
    }
  } catch (error) {
    // Fallback if DB is not reachable during initial build
  }

  return {
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
      icon: [{ url: siteIcon }],
      shortcut: siteIcon,
      apple: siteIcon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteIcon = "/images/logo.png";
  try {
    const iconSetting = await prisma.setting.findUnique({
      where: { key: "site_icon" },
    });
    if (iconSetting?.value) {
      siteIcon = iconSetting.value;
    }
  } catch (error) {
    // Fallback
  }

  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-obsidian-950 font-sans text-zinc-100"
        suppressHydrationWarning
      >
        <FaviconSync />
        <LuxuryCursor />
        <Providers>
          <Navbar siteLogo={siteIcon} />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer siteLogo={siteIcon} />
        </Providers>
      </body>
    </html>
  );
}
