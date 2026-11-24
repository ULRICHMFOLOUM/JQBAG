"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#1a1d2b",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#fff",
            },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
