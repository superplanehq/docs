// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import starlightImageZoom from "starlight-image-zoom";
import { sidebar } from "./src/config/sidebar.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mermaid({ autoTheme: true }),
    starlight({
      plugins: [starlightImageZoom()],
      title: "SuperPlane Docs",
      customCss: ["./src/styles/custom.css"],
      logo: {
        src: "./src/assets/superplane-logo.svg",
      },
      components: {
        Head: "./src/components/CustomHead.astro",
        SiteTitle: "./src/components/CustomSiteTitle.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/superplanehq/docs",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.superplane.com",
        },
      ],
      sidebar,
    }),
  ],
});
