import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        // Customize caching strategy here if needed
      },
      manifest: {
        name: "Color Wars (Alpha)",
        short_name: "ColorWars (Alpha)",
        start_url: "/",
        display: "standalone",
        background_color: "#7b00a1",
        theme_color: "#7b00a1",
        icons: [
          {
            src: "/color_wars192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/color_wars.png",
            sizes: "92x92",
            type: "image/png",
          },
        ],
        share_target: {
          action: "/share",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: {
            title: "title",
            text: "link",
            link: "link",
          },
        },
      },
    }),
  ],
});
