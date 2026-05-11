import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "AutoTrack",
        short_name: "AutoTrack",
        description: "Aplicație pentru gestionarea cheltuielilor auto",
        theme_color: "#020916",
        background_color: "#020916",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png?v=4",
            izes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png?v=4",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});