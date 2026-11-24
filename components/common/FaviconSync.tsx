"use client";

import { useEffect } from "react";

export function FaviconSync() {
  useEffect(() => {
    try {
      const savedIcon = localStorage.getItem("jqbags_site_icon");
      if (savedIcon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = savedIcon;

        let appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
        if (!appleLink) {
          appleLink = document.createElement("link");
          appleLink.rel = "apple-touch-icon";
          document.head.appendChild(appleLink);
        }
        appleLink.href = savedIcon;
      }
    } catch (e) {
      // Ignorer les erreurs d'accès au stockage local
    }
  }, []);

  return null;
}
